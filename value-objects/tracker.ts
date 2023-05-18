import z from "zod";

import { TrackerName } from "./tracker-name";
import { TrackerKind } from "./tracker-kind";

export const Tracker = z.object({
  name: TrackerName,
  kind: TrackerKind,
});
export type TrackerType = z.infer<typeof Tracker>;
