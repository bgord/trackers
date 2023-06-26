import { GoalKindEnum } from "../value-objects/goal-kind-enum";
import type { GoalTargetType } from "../value-objects/goal-target";
import type { TrackerValueType } from "../../trackers/value-objects/tracker-value";

export type GoalConfigType = {
  kind: GoalKindEnum;
  target: GoalTargetType;
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
    GoalKindEnum,
    (config: GoalConfigType, value: TrackerValueType) => boolean
  > = {
    [GoalKindEnum.minimum]: (config, value) => value >= config.target,
    [GoalKindEnum.maximum]: (config, value) => value <= config.target,
  };
}
