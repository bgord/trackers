import * as bg from "@bgord/node";
import _ from "lodash";

import { TRACKER_VALUE_DEFAULT } from "../../trackers/value-objects/tracker-value-default";
import type { TrackerType } from "../../trackers/value-objects/tracker";

import * as VO from "../value-objects";
import * as Events from "../events";
import * as infra from "../../../infra";
import * as Policies from "../policies";
import * as Services from "../services";

export class Goal {
  id: VO.GoalType["id"];

  TRACKER_VALUE_DEFAULT = TRACKER_VALUE_DEFAULT;

  stream: bg.EventType["stream"];

  entity: VO.GoalType | null = null;

  constructor(id: VO.GoalType["id"]) {
    this.id = id;
    this.stream = Goal.getStream(id);
  }

  async build() {
    const events = await infra.EventStore.find(
      [
        Events.GoalCreatedEvent,
        Events.GoalDeletedEvent,
        Events.GoalAccomplishedEvent,
        Events.GoalRegressedEvent,
      ],
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

        case Events.GOAL_ACCOMPLISHED_EVENT:
          if (!this.entity) continue;
          this.entity.status = VO.GoalStatusEnum.accomplished;
          this.entity.updatedAt = event.payload.accomplishedAt;
          break;

        case Events.GOAL_REGRESSED_EVENT:
          if (!this.entity) continue;
          this.entity.status = VO.GoalStatusEnum.awaiting;
          this.entity.updatedAt = event.payload.regressedAt;
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
        payload: {
          id: this.id,
          relatedTrackerId: this.entity?.relatedTrackerId,
          target: this.entity?.target,
          kind: this.entity?.kind,
        },
      })
    );
  }

  async evaluate(tracker: Pick<TrackerType, "id" | "value">) {
    await Policies.GoalShouldExist.perform({ goal: this });
    if (!this.entity) return;

    const verifier = new Services.GoalVerifier({
      kind: this.entity.kind,
      target: this.entity.target,
    });
    const goalWouldBeAccomplished = verifier.verify(tracker.value);

    if (
      goalWouldBeAccomplished &&
      this.entity.status !== VO.GoalStatusEnum.accomplished &&
      tracker.value !== this.TRACKER_VALUE_DEFAULT
    ) {
      await infra.EventStore.save(
        Events.GoalAccomplishedEvent.parse({
          name: Events.GOAL_ACCOMPLISHED_EVENT,
          stream: this.stream,
          version: 1,
          payload: { id: this.id, trackerId: tracker.id },
        })
      );
    }

    if (
      !goalWouldBeAccomplished &&
      this.entity.status === VO.GoalStatusEnum.accomplished
    ) {
      await infra.EventStore.save(
        Events.GoalRegressedEvent.parse({
          name: Events.GOAL_REGRESSED_EVENT,
          stream: this.stream,
          version: 1,
          payload: {
            id: this.id,
            relatedTrackerId: this.entity.relatedTrackerId,
          },
        })
      );
    }
  }

  static getStream(id: VO.GoalIdType) {
    return `goal_${id}`;
  }
}
