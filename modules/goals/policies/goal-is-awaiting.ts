import * as bg from "@bgord/node";

import * as Aggregates from "../aggregates";
import * as VO from "../value-objects";

export class GoalIsAwaitingError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, GoalIsAwaitingError.prototype);
  }
}

type GoalIsAwaitingConfigType = {
  goal: Aggregates.Goal;
};

class GoalIsAwaitingFactory extends bg.Policy<GoalIsAwaitingConfigType> {
  async fails(config: GoalIsAwaitingConfigType): Promise<boolean> {
    return config.goal.entity?.status !== VO.GoalStatusEnum.awaiting;
  }

  message = "goal.awaiting.error";

  error = GoalIsAwaitingError;
}

export const GoalIsAwaiting = new GoalIsAwaitingFactory();
