import * as VO from "../value-objects";
import { TrackerValueType } from "../../trackers/value-objects/tracker-value";

export type GoalConfigType = {
  kind: VO.GoalKindEnum;
  target: VO.GoalTargetType;
};

export class GoalVerifier {
  config: GoalConfigType;

  constructor(config: GoalConfigType) {
    this.config = config;
  }

  verify(current: TrackerValueType): boolean {
    return this.mapGoalKindToVerifier[this.config.kind](this.config, current);
  }

  private mapGoalKindToVerifier: Record<
    VO.GoalKindEnum,
    (config: GoalConfigType, value: TrackerValueType) => boolean
  > = {
    [VO.GoalKindEnum.minimum]: (config, value) => value >= config.target,
    [VO.GoalKindEnum.maximum]: (config, value) => value <= config.target,
  };
}
