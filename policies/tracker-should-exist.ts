import * as bg from "@bgord/node";
import * as Aggregates from "../aggregates";

export class TrackerShouldExistError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, TrackerShouldExistError.prototype);
  }
}

type TrackerShouldExistConfigType = {
  tracker: Aggregates.Tracker;
};

class TrackerShouldExistFactory extends bg.Policy<TrackerShouldExistConfigType> {
  async fails(config: TrackerShouldExistConfigType): Promise<boolean> {
    return config.tracker.entity === null;
  }

  error = TrackerShouldExistError;
}

export const TrackerShouldExist = new TrackerShouldExistFactory();
