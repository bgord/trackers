import * as bg from "@bgord/node";

import * as Aggregates from "../aggregates";
import * as VO from "../value-objects";

export class TrackerIsArchivedError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, TrackerIsArchivedError.prototype);
  }
}

type TrackerIsArchivedConfigType = {
  tracker: Aggregates.Tracker;
};

class TrackerIsArchivedFactory extends bg.Policy<TrackerIsArchivedConfigType> {
  async fails(config: TrackerIsArchivedConfigType): Promise<boolean> {
    return config.tracker.entity?.status !== VO.TrackerStatusEnum.archived;
  }

  message = "tracker.archived.error";

  error = TrackerIsArchivedError;
}

export const TrackerIsArchived = new TrackerIsArchivedFactory();
