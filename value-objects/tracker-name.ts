import z from "zod";

import { TRACKER_NAME_ERROR_KEY } from "./tracker-name-error-key";
import { TRACKER_NAME_MIN_LENGTH } from "./tracker-name-min-length";
import { TRACKER_NAME_MAX_LENGTH } from "./tracker-name-max-length";

export const TrackerName = z
  .string()
  .min(TRACKER_NAME_MIN_LENGTH, { message: TRACKER_NAME_ERROR_KEY })
  .max(TRACKER_NAME_MAX_LENGTH, { message: TRACKER_NAME_ERROR_KEY });
export type TrackerNameType = z.infer<typeof TrackerName>;
