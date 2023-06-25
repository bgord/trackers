import { Tracker } from "../../trackers/aggregates/tracker";
import { TrackerShouldExist, TrackerIsActive } from "../../trackers/policies";

import { Goal } from "../aggregates/goal";
import * as VO from "../value-objects";
import * as Policies from "../policies";

export class GoalFactory {
  static async create(
    payload: Pick<VO.GoalType, "kind" | "target" | "relatedTrackerId">
  ) {
    const tracker = await new Tracker(payload.relatedTrackerId).build();

    await TrackerShouldExist.perform({ tracker });
    await TrackerIsActive.perform({ tracker });
    await Policies.GoalShouldNotBeAutomaticallyAccomplished.perform({
      tracker,
      goal: payload,
    });

    return Goal.create(payload);
  }
}
