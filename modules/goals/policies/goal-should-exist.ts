import * as bg from "@bgord/node";
import * as Aggregates from "../aggregates";

export class GoalShouldExistError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, GoalShouldExistError.prototype);
  }
}

type GoalShouldExistConfigType = {
  Goal: Aggregates.Goal;
};

class GoalShouldExistFactory extends bg.Policy<GoalShouldExistConfigType> {
  async fails(config: GoalShouldExistConfigType): Promise<boolean> {
    return config.Goal.entity === null;
  }

  message = "goal.exists.error";

  error = GoalShouldExistError;
}

export const GoalShouldExist = new GoalShouldExistFactory();
