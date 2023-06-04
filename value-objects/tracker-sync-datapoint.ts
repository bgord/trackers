import z from "zod";

import { TrackerValue } from "./tracker-value";
import { TrackerUpdatedAt } from "./tracker-updated-at";
import { TrackerId } from "./tracker-id";

export const TrackerSyncDatapoint = z.object({
  trackerId: TrackerId,
  value: TrackerValue,
  createdAt: TrackerUpdatedAt,
});
export type TrackerSyncDatapointType = z.infer<typeof TrackerSyncDatapoint>;
