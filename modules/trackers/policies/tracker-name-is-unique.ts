import * as bg from "@bgord/node";
import * as VO from "../value-objects";
import * as Repos from "../repositories";

export class TrackerNameIsUniqueError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, TrackerNameIsUniqueError.prototype);
  }
}

type TrackerNameIsUniqueErrorConfigType = {
  trackerName: VO.TrackerType["name"];
};

class TrackerNameIsUniqueFactory extends bg.Policy<TrackerNameIsUniqueErrorConfigType> {
  async fails(config: TrackerNameIsUniqueErrorConfigType): Promise<boolean> {
    const numberOfTrackersWithName =
      await Repos.TrackerRepository.countTrackersWithName(config.trackerName);

    return numberOfTrackersWithName > 0;
  }

  message = "tracker.name.unique.error";

  error = TrackerNameIsUniqueError;
}

export const TrackerNameIsUnique = new TrackerNameIsUniqueFactory();
