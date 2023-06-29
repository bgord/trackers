import * as bg from "@bgord/node";

import * as VO from "../value-objects";
import * as Repos from "../repositories";

export class TrackerDatapointShouldExistError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, TrackerDatapointShouldExistError.prototype);
  }
}

type TrackerDatapointShouldExistConfigType = {
  datapointId: VO.DatapointIdType;
};

class TrackerDatapointShouldExistFactory extends bg.Policy<TrackerDatapointShouldExistConfigType> {
  async fails(config: TrackerDatapointShouldExistConfigType): Promise<boolean> {
    const datapoint = await Repos.TrackerDatapointRepository.getDatapoint(
      config.datapointId
    );
    return datapoint === null;
  }

  message = "tracker.datapoint.revert.error.does_not_exist";

  error = TrackerDatapointShouldExistError;
}

export const TrackerDatapointShouldExist =
  new TrackerDatapointShouldExistFactory();
