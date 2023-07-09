import z from "zod";

import { TRACKER_VALUE_DEFAULT } from "./tracker-value-default";
import { TRACKER_COUNTER_VALUE_ERROR_KEY } from "./tracker-counter-value-error-key";

export const TrackerValue = z.coerce
  .number()
  .positive()
  .brand("tracker-value")
  .default(TRACKER_VALUE_DEFAULT);
export type TrackerValueType = z.infer<typeof TrackerValue>;

export const TrackerCounterValue = z.coerce
  .number()
  .positive()
  .int({ message: TRACKER_COUNTER_VALUE_ERROR_KEY })
  .brand("tracker-value")
  .default(TRACKER_VALUE_DEFAULT);
export type TrackerCounterValueType = z.infer<typeof TrackerCounterValue>;
