import * as bg from "@bgord/node";

import * as Trackers from "../../trackers";

import * as Services from "../services";
import * as VO from "../value-objects";

export class GoalShouldNotAlreadyBeAccomplishedError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(
      this,
      GoalShouldNotAlreadyBeAccomplishedError.prototype
    );
  }
}

type GoalShouldNotAlreadyBeAccomplishedConfigType = {
  tracker: Trackers.Aggregates.Tracker;
  goal: Pick<VO.GoalType, "kind" | "target" | "relatedTrackerId">;
};

class GoalShouldNotAlreadyBeAccomplishedFactory extends bg.Policy<GoalShouldNotAlreadyBeAccomplishedConfigType> {
  async fails(
    config: GoalShouldNotAlreadyBeAccomplishedConfigType
  ): Promise<boolean> {
    const verifier = new Services.GoalVerifier(config.goal);

    return verifier.verify(config.tracker.entity!.value);
  }

  message = "goal.already.accomplished.error";

  error = GoalShouldNotAlreadyBeAccomplishedError;
}

export const GoalShouldNotAlreadyBeAccomplished =
  new GoalShouldNotAlreadyBeAccomplishedFactory();
