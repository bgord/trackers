import * as bg from "@bgord/node";

import * as VO from "../value-objects";
import * as Repos from "../repositories";

export class DatapointsLimitPerDayError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, DatapointsLimitPerDayError.prototype);
  }
}

type DatapointsLimitPerDayConfigType = {
  trackerId: VO.TrackerIdType;
  limit: number;
  timeZoneOffset: bg.TimeZoneOffsetsType;
};

class DatapointsLimitPerDayFactory extends bg.Policy<DatapointsLimitPerDayConfigType> {
  async fails(config: DatapointsLimitPerDayConfigType): Promise<boolean> {
    const numberOfTrackerDatapointsToday =
      await Repos.DatapointRepository.countDatapointsFromToday(
        config.trackerId,
        { timeZoneOffset: config.timeZoneOffset }
      );

    return config.limit <= numberOfTrackerDatapointsToday;
  }

  message = "tracker.sync.error.datapoints_per_daylimit_reached";

  error = DatapointsLimitPerDayError;
}

export const DatapointsLimitPerDay = new DatapointsLimitPerDayFactory();
