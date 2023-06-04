import * as bg from "@bgord/node";
import * as VO from "../value-objects";

export class TrackerValueShouldChangeError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, TrackerValueShouldChangeError.prototype);
  }
}

type TrackerValueShouldChangeErrorConfigType = {
  currentValue: VO.TrackerValueType;
  syncedValue: VO.TrackerValueType;
};

class TrackerValueShouldChangeFactory extends bg.Policy<TrackerValueShouldChangeErrorConfigType> {
  async fails(
    config: TrackerValueShouldChangeErrorConfigType
  ): Promise<boolean> {
    return config.currentValue === config.syncedValue;
  }

  error = TrackerValueShouldChangeError;
}

export const TrackerValueShouldChange = new TrackerValueShouldChangeFactory();
