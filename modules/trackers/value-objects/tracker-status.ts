import { z } from "zod";

import { TrackerStatusEnum } from "./tracker-status-enum";
import { TRACKER_STATUS_ERROR_KEY } from "./tracker-status-error-key";

export const TrackerStatus = z
  .nativeEnum(TrackerStatusEnum, {
    errorMap: () => ({ message: TRACKER_STATUS_ERROR_KEY }),
  })
  .default(TrackerStatusEnum.active);

export type TrackerStatusType = z.infer<typeof TrackerStatus>;
