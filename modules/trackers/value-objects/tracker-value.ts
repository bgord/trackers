import z from "zod";

import { TRACKER_COUNTER_VALUE_ERROR_KEY } from "./tracker-counter-value-error-key";

export const DEFAULT_TRACKER_VALUE = 0;

export const TrackerValue = z.coerce
  .number()
  .brand("tracker-value")
  .default(DEFAULT_TRACKER_VALUE);
export type TrackerValueType = z.infer<typeof TrackerValue>;

export const TrackerCounterValue = z.coerce
  .number()
  .positive()
  .int({ message: TRACKER_COUNTER_VALUE_ERROR_KEY })
  .brand("tracker-value")
  .default(DEFAULT_TRACKER_VALUE);
export type TrackerCounterValueType = z.infer<typeof TrackerCounterValue>;
