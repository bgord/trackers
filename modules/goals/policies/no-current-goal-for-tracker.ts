import * as bg from "@bgord/node";

import * as VO from "../value-objects";
import * as Repos from "../repositories";

export class NoCurrentGoalForTrackerError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, NoCurrentGoalForTrackerError.prototype);
  }
}

type NoCurrentGoalForTrackerConfigType = {
  relatedTrackerId: VO.GoalRelatedTrackerIdType;
};

class NoCurrentGoalForTrackerFactory extends bg.Policy<NoCurrentGoalForTrackerConfigType> {
  async fails(config: NoCurrentGoalForTrackerConfigType): Promise<boolean> {
    const numberOfCurrentGoals =
      await Repos.GoalRepository.countGoalsForTracker(config);

    return numberOfCurrentGoals > 0;
  }

  message = "goal.tracker.current.error";

  error = NoCurrentGoalForTrackerError;
}

export const NoCurrentGoalForTracker = new NoCurrentGoalForTrackerFactory();
