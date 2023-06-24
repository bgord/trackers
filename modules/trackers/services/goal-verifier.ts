import * as VO from "../value-objects";

export type GoalConfigType = {
  kind: VO.GoalKindEnum;
  target: VO.GoalTargetType;
};

export class GoalVerifier {
  config: GoalConfigType;

  constructor(config: GoalConfigType) {
    this.config = config;
  }

  verify(current: VO.TrackerValueType): boolean {
    return this.mapGoalKindToVerifier[this.config.kind](this.config, current);
  }

  private mapGoalKindToVerifier: Record<
    VO.GoalKindEnum,
    (config: GoalConfigType, value: VO.TrackerValueType) => boolean
  > = {
    [VO.GoalKindEnum.minimum]: (config, value) => config.target >= value,
    [VO.GoalKindEnum.maximum]: (config, value) => config.target <= value,
  };
}
