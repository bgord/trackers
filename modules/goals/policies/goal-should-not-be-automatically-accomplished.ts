import * as bg from "@bgord/node";

import * as Trackers from "../../trackers";

import * as Services from "../services";
import * as VO from "../value-objects";

export class GoalShouldNotBeAutomaticallyAccomplishedError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(
      this,
      GoalShouldNotBeAutomaticallyAccomplishedError.prototype
    );
  }
}

type GoalShouldNotBeAutomaticallyAccomplishedConfigType = {
  tracker: Trackers.Aggregates.Tracker;
  goal: Pick<VO.GoalType, "kind" | "target" | "relatedTrackerId">;
};

class GoalShouldNotBeAutomaticallyAccomplishedFactory extends bg.Policy<GoalShouldNotBeAutomaticallyAccomplishedConfigType> {
  async fails(
    config: GoalShouldNotBeAutomaticallyAccomplishedConfigType
  ): Promise<boolean> {
    const verifier = new Services.GoalVerifier(config.goal);

    return verifier.verify(config.tracker.entity!.value);
  }

  message = "goal.automatically.accomplished.error";

  error = GoalShouldNotBeAutomaticallyAccomplishedError;
}

export const GoalShouldNotBeAutomaticallyAccomplished =
  new GoalShouldNotBeAutomaticallyAccomplishedFactory();
