import * as bg from "@bgord/node";
import _ from "lodash";

import * as VO from "../value-objects";
import * as Events from "../events";
import * as infra from "../../../infra";
import * as Policies from "../policies";

export class Goal {
  id: VO.GoalType["id"];

  stream: bg.EventType["stream"];

  entity: VO.GoalType | null = null;

  constructor(id: VO.GoalType["id"]) {
    this.id = id;
    this.stream = Goal.getStream(id);
  }

  async build() {
    const events = await infra.EventStore.find(
      [Events.GoalCreatedEvent, Events.GoalDeletedEvent],
      Goal.getStream(this.id)
    );

    for (const event of events) {
      switch (event.name) {
        case Events.GOAL_CREATED_EVENT:
          this.entity = event.payload;
          break;

        case Events.GOAL_DELETED_EVENT:
          this.entity = null;
          break;

        default:
          continue;
      }
    }

    return this;
  }

  static async create(
    payload: Pick<VO.GoalType, "kind" | "relatedTrackerId" | "target">
  ) {
    const id = VO.GoalId.parse(bg.NewUUID.generate());

    await Policies.NoCurrentGoalForTracker.perform({
      relatedTrackerId: payload.relatedTrackerId,
    });

    await infra.EventStore.save(
      Events.GoalCreatedEvent.parse({
        name: Events.GOAL_CREATED_EVENT,
        stream: Goal.getStream(id),
        version: 1,
        payload: { id, ...payload },
      })
    );
  }

  async delete() {
    await Policies.GoalShouldExist.perform({ goal: this });

    await infra.EventStore.save(
      Events.GoalDeletedEvent.parse({
        name: Events.GOAL_DELETED_EVENT,
        stream: this.stream,
        version: 1,
        payload: { id: this.id },
      })
    );
  }

  static getStream(id: VO.GoalIdType) {
    return `goal_${id}`;
  }
}
