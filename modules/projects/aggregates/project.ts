import * as bg from "@bgord/node";

import * as Events from "../events";
import * as VO from "../value-objects";
import * as Policies from "../policies";

import * as infra from "../../../infra";

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

  static getStream(id: VO.ProjectIdType) {
    return `project_${id}`;
  }
}
