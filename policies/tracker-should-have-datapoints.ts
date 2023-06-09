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
  VO.TrackerDatapointType,
  "trackerId"
>;

class TrackerShouldHaveDatapointsFactory extends bg.Policy<TrackerShouldHaveDatapointsConfigType> {
  async fails(config: TrackerShouldHaveDatapointsConfigType): Promise<boolean> {
    const numberOfDatapoints =
      await Repos.TrackerDatapointRepository.countDatapointsForTracker(config);

    return numberOfDatapoints === 0;
  }

  error = TrackerShouldHaveDatapointsError;
}

export const TrackerShouldHaveDatapoints =
  new TrackerShouldHaveDatapointsFactory();
