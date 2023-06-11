import * as bg from "@bgord/node";

import * as Repos from "../repositories";

export class MinimumOneTrackerExistsError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, MinimumOneTrackerExistsError.prototype);
  }
}

type MinimumOneTrackerExistsConfigType = Record<string, never>;

class MinimumOneTrackerExistsFactory extends bg.Policy<MinimumOneTrackerExistsConfigType> {
  async fails(_config: MinimumOneTrackerExistsConfigType): Promise<boolean> {
    const numberOfTrackers = await Repos.TrackerRepository.count();

    return numberOfTrackers === 0;
  }

  error = MinimumOneTrackerExistsError;
}

export const MinimumOneTrackerExists = new MinimumOneTrackerExistsFactory();
