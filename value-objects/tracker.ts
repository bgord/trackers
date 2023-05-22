import z from "zod";

import { TrackerId } from "./tracker-id";
import { TrackerName } from "./tracker-name";
import { TrackerKind } from "./tracker-kind";
import { TrackerCreatedAt } from "./tracker-created-at";

export const Tracker = z.object({
  id: TrackerId,
  name: TrackerName,
  kind: TrackerKind,
  createdAt: TrackerCreatedAt,
});
export type TrackerType = z.infer<typeof Tracker>;
