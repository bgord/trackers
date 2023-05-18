import { z } from "zod";

import { TrackerKindEnum } from "./tracker-kind-enum";
import { TRACKER_KIND_ERROR_KEY } from "./tracker-kind-error-key";

export const TrackerKind = z
  .nativeEnum(TrackerKindEnum, {
    errorMap: () => ({ message: TRACKER_KIND_ERROR_KEY }),
  })
  .default(TrackerKindEnum.one_value);

export type TrackerKindType = z.infer<typeof TrackerKind>;
