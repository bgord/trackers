import z from "zod";

export const DEFAULT_TRACKER_VALUE = 0;

export const TrackerValue = z.coerce
  .number()
  .brand("tracker-value")
  .default(DEFAULT_TRACKER_VALUE);
export type TrackerValueType = z.infer<typeof TrackerValue>;
