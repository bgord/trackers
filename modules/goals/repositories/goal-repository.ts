import * as infra from "../../../infra";

import * as VO from "../value-objects";

export class GoalRepository {
  static async countGoalsForTracker(
    payload: Pick<VO.GoalType, "relatedTrackerId">
  ) {
    return infra.db.goal.count({ where: payload });
  }

  static async create(data: VO.GoalType) {
    return infra.db.goal.create({ data });
  }
}
