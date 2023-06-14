import * as bg from "@bgord/node";
import * as VO from "../value-objects";

export class TrackerValueShouldChangeError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, TrackerValueShouldChangeError.prototype);
  }
}

type TrackerValueShouldChangeConfigType = {
  currentValue: VO.TrackerValueType;
  syncedValue: VO.TrackerValueType;
};

class TrackerValueShouldChangeFactory extends bg.Policy<TrackerValueShouldChangeConfigType> {
  async fails(config: TrackerValueShouldChangeConfigType): Promise<boolean> {
    return config.currentValue === config.syncedValue;
  }

  message = "tracker.sync.error.value_not_changed";

  error = TrackerValueShouldChangeError;
}

export const TrackerValueShouldChange = new TrackerValueShouldChangeFactory();
