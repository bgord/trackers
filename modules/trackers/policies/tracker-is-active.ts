import * as bg from "@bgord/node";

import * as Aggregates from "../aggregates";
import * as VO from "../value-objects";

export class TrackerIsActiveError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, TrackerIsActiveError.prototype);
  }
}

type TrackerIsActiveConfigType = {
  tracker: Aggregates.Tracker;
};

class TrackerIsActiveFactory extends bg.Policy<TrackerIsActiveConfigType> {
  async fails(config: TrackerIsActiveConfigType): Promise<boolean> {
    return config.tracker.entity?.status !== VO.TrackerStatusEnum.active;
  }

  message = "tracker.active.error";

  error = TrackerIsActiveError;
}

export const TrackerIsActive = new TrackerIsActiveFactory();
