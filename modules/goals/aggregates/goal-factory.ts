import { Tracker } from "../../trackers/aggregates/tracker";
import { TrackerShouldExist, TrackerIsActive } from "../../trackers/policies";

import { Goal } from "./goal";
import * as VO from "../value-objects";

export class GoalFactory {
  static async create(
    payload: Pick<VO.GoalType, "kind" | "target" | "relatedTrackerId">
  ) {
    const tracker = await new Tracker(payload.relatedTrackerId).build();

    await TrackerShouldExist.perform({ tracker });
    await TrackerIsActive.perform({ tracker });

    return await Goal.create(payload);
  }
}
