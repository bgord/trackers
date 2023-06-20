import * as bg from "@bgord/node";

import * as Events from "../events";
import * as VO from "../value-objects";
import * as Policies from "../policies";

import * as infra from "../../../infra";
import { Task } from "./task";

export class Project {
  id: VO.ProjectIdType;

  stream: bg.EventType["stream"];

  entity: VO.ProjectType | null = null;

  constructor(id: VO.ProjectIdType) {
    this.id = id;
    this.stream = Project.getStream(id);
  }

  async build() {
    const events = await infra.EventStore.find(
      [
        Events.ProjectCreatedEvent,
        Events.ProjectDeletedEvent,
        Events.ProjectArchivedEvent,
        Events.ProjectRestoredEvent,
        Events.TaskCreatedEvent,
      ],
      this.stream
    );

    for (const event of events) {
      /* eslint-disable sonarjs/no-small-switch */
      switch (event.name) {
        case Events.PROJECT_CREATED_EVENT:
          this.entity = event.payload;
          break;

        case Events.PROJECT_DELETED_EVENT:
          this.entity = null;
          break;

        case Events.PROJECT_ARCHIVED_EVENT:
          if (!this.entity) continue;
          this.entity.status = VO.ProjectStatusEnum.archived;
          break;

        case Events.PROJECT_RESTORED_EVENT:
          if (!this.entity) continue;
          this.entity.status = VO.ProjectStatusEnum.active;
          break;

        default:
          continue;
      }
    }

    return this;
  }

  static async create(payload: Pick<VO.ProjectType, "name">) {
    const id = VO.ProjectId.parse(bg.NewUUID.generate());

    await Policies.ProjectNameIsUnique.perform(payload);

    await infra.EventStore.save(
      Events.ProjectCreatedEvent.parse({
        name: Events.PROJECT_CREATED_EVENT,
        stream: Project.getStream(id),
        version: 1,
        payload: { id, ...payload },
      })
    );
  }

  async delete() {
    await Policies.ProjectShouldExist.perform({ project: this });

    await infra.EventStore.save(
      Events.ProjectDeletedEvent.parse({
        name: Events.PROJECT_DELETED_EVENT,
        stream: this.stream,
        version: 1,
        payload: { id: this.id },
      })
    );
  }

  async archive() {
    await Policies.ProjectShouldExist.perform({ project: this });
    await Policies.ProjectShouldBeActive.perform({ project: this });

    await infra.EventStore.save(
      Events.ProjectArchivedEvent.parse({
        name: Events.PROJECT_ARCHIVED_EVENT,
        stream: this.stream,
        version: 1,
        payload: { id: this.id },
      })
    );
  }

  async restore() {
    await Policies.ProjectShouldExist.perform({ project: this });
    await Policies.ProjectShouldBeArchived.perform({ project: this });

    await infra.EventStore.save(
      Events.ProjectRestoredEvent.parse({
        name: Events.PROJECT_RESTORED_EVENT,
        stream: this.stream,
        version: 1,
        payload: { id: this.id },
      })
    );
  }

  async addTask(task: Pick<VO.TaskType, "name">) {
    await Policies.ProjectShouldExist.perform({ project: this });
    await Policies.ProjectShouldBeActive.perform({ project: this });
    await Policies.ProjectTaskNameIsUnique.perform({
      id: this.id,
      name: task.name,
    });

    await infra.EventStore.save(
      Events.TaskCreatedEvent.parse({
        name: Events.TASK_CREATED_EVENT,
        stream: Task.getStream(VO.TaskId.parse(bg.NewUUID.generate())),
        version: 1,
        payload: { projectId: this.id, name: task.name },
      })
    );
  }

  static getStream(id: VO.ProjectIdType) {
    return `project_${id}`;
  }
}
