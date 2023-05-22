import z from "zod";

import { TrackerId } from "./tracker-id";
import { TrackerName } from "./tracker-name";
import { TrackerKind } from "./tracker-kind";

export const Tracker = z.object({
  id: TrackerId,
  name: TrackerName,
  kind: TrackerKind,
});
export type TrackerType = z.infer<typeof Tracker>;
