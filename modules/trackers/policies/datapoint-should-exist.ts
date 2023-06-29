import * as bg from "@bgord/node";

import * as VO from "../value-objects";
import * as Repos from "../repositories";

export class DatapointShouldExistError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, DatapointShouldExistError.prototype);
  }
}

type DatapointShouldExistConfigType = {
  datapointId: VO.DatapointIdType;
};

class DatapointShouldExistFactory extends bg.Policy<DatapointShouldExistConfigType> {
  async fails(config: DatapointShouldExistConfigType): Promise<boolean> {
    const datapoint = await Repos.DatapointRepository.getDatapoint(
      config.datapointId
    );
    return datapoint === null;
  }

  message = "tracker.datapoint.revert.error.does_not_exist";

  error = DatapointShouldExistError;
}

export const DatapointShouldExist = new DatapointShouldExistFactory();
