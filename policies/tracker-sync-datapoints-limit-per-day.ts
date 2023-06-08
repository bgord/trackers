import * as bg from "@bgord/node";

import * as VO from "../value-objects";
import * as Repos from "../repositories";

export class TrackerSyncDatapointsLimitPerDayError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(
      this,
      TrackerSyncDatapointsLimitPerDayError.prototype
    );
  }
}

type TrackerSyncDatapointsLimitPerDayConfigType = {
  trackerId: VO.TrackerIdType;
  limit: number;
  tz: bg.TimeZoneOffsetsType;
};

class TrackerSyncDatapointsLimitPerDayFactory extends bg.Policy<TrackerSyncDatapointsLimitPerDayConfigType> {
  async fails(
    config: TrackerSyncDatapointsLimitPerDayConfigType
  ): Promise<boolean> {
    const numberOfTrackerSyncDatapointsToday =
      await Repos.TrackerSyncDatapointRepository.getDatapointsForToday(
        config.trackerId,
        config.tz
      );

    return config.limit <= numberOfTrackerSyncDatapointsToday;
  }

  error = TrackerSyncDatapointsLimitPerDayError;
}

export const TrackerSyncDatapointsLimitPerDay =
  new TrackerSyncDatapointsLimitPerDayFactory();
