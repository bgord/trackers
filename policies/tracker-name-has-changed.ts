import * as bg from "@bgord/node";

import * as VO from "../value-objects";

export class TrackerNameHasChangedError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, TrackerNameHasChangedError.prototype);
  }
}

type TrackerNameHasChangedConfigType = {
  current: VO.TrackerNameType;
  next: VO.TrackerNameType;
};

class TrackerNameHasChangedFactory extends bg.Policy<TrackerNameHasChangedConfigType> {
  async fails(config: TrackerNameHasChangedConfigType): Promise<boolean> {
    return config.current === config.next;
  }

  message = "tracker.name.new.change.error.not_changed";

  error = TrackerNameHasChangedError;
}

export const TrackerNameHasChanged = new TrackerNameHasChangedFactory();
