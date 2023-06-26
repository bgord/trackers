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

  static async delete(config: { id: VO.GoalIdType }) {
    return infra.db.goal.delete({ where: config });
  }

  static async accomplish(config: {
    id: VO.GoalIdType;
    accomplishedAt: VO.GoalUpdatedAtType;
  }) {
    return infra.db.goal.update({
      where: { id: config.id },
      data: {
        status: VO.GoalStatusEnum.accomplished,
        updatedAt: config.accomplishedAt,
      },
    });
  }

  static async regress(config: {
    id: VO.GoalIdType;
    regressedAt: VO.GoalUpdatedAtType;
  }) {
    return infra.db.goal.update({
      where: { id: config.id },
      data: {
        status: VO.GoalStatusEnum.awaiting,
        updatedAt: config.regressedAt,
      },
    });
  }

  static async getForTracker(payload: Pick<VO.GoalType, "relatedTrackerId">) {
    return infra.db.goal.findFirst({ where: payload });
  }
}
