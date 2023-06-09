import * as bg from "@bgord/node";

import * as VO from "../value-objects";
import * as Repos from "../repositories";

export class TrackerDatapointsLimitPerDayError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, TrackerDatapointsLimitPerDayError.prototype);
  }
}

type TrackerDatapointsLimitPerDayConfigType = {
  trackerId: VO.TrackerIdType;
  limit: number;
  timeZoneOffset: bg.TimeZoneOffsetsType;
};

class TrackerDatapointsLimitPerDayFactory extends bg.Policy<TrackerDatapointsLimitPerDayConfigType> {
  async fails(
    config: TrackerDatapointsLimitPerDayConfigType
  ): Promise<boolean> {
    const numberOfTrackerDatapointsToday =
      await Repos.TrackerDatapointRepository.countDatapointsFromToday(
        config.trackerId,
        { timeZoneOffset: config.timeZoneOffset }
      );

    return config.limit <= numberOfTrackerDatapointsToday;
  }

  error = TrackerDatapointsLimitPerDayError;
}

export const TrackerDatapointsLimitPerDay =
  new TrackerDatapointsLimitPerDayFactory();
