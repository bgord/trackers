import * as bg from "@bgord/node";

import * as Repos from "../repositories";

export class MinimumOneActiveTrackerExistsError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, MinimumOneActiveTrackerExistsError.prototype);
  }
}

type MinimumOneActiveTrackerExistsConfigType = Record<string, never>;

class MinimumOneActiveTrackerExistsFactory extends bg.Policy<MinimumOneActiveTrackerExistsConfigType> {
  async fails(
    _config: MinimumOneActiveTrackerExistsConfigType
  ): Promise<boolean> {
    const numberOfActiveTrackers = await Repos.TrackerRepository.countActive();

    return numberOfActiveTrackers === 0;
  }

  message = "tracker.active.empty";

  error = MinimumOneActiveTrackerExistsError;
}

export const MinimumOneActiveTrackerExists =
  new MinimumOneActiveTrackerExistsFactory();
