import z from "zod";

import { TRACKER_NAME_MIN_LENGTH } from "./tracker-name-min-length";
import { TRACKER_NAME_MAX_LENGTH } from "./tracker-name-max-length";

export const TrackerName = z
  .string()
  .min(TRACKER_NAME_MIN_LENGTH)
  .max(TRACKER_NAME_MAX_LENGTH)
  .brand("tracker-name");
export type TrackerNameType = z.infer<typeof TrackerName>;
