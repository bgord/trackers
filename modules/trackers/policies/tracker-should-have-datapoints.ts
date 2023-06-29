import * as bg from "@bgord/node";

import * as VO from "../value-objects";
import * as Repos from "../repositories";

export class TrackerShouldHaveDatapointsError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, TrackerShouldHaveDatapointsError.prototype);
  }
}

type TrackerShouldHaveDatapointsConfigType = Pick<
  VO.DatapointType,
  "trackerId"
>;

class TrackerShouldHaveDatapointsFactory extends bg.Policy<TrackerShouldHaveDatapointsConfigType> {
  async fails(config: TrackerShouldHaveDatapointsConfigType): Promise<boolean> {
    const numberOfDatapoints =
      await Repos.DatapointRepository.countDatapointsForTracker(config);

    return numberOfDatapoints === 0;
  }

  message = "tracker.sync.error.no_datapoints";

  error = TrackerShouldHaveDatapointsError;
}

export const TrackerShouldHaveDatapoints =
  new TrackerShouldHaveDatapointsFactory();
