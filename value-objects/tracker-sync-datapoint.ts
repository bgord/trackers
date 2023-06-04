import z from "zod";

import { TrackerValue } from "./tracker-value";
import { TrackerUpdatedAt } from "./tracker-updated-at";
import { TrackerId } from "./tracker-id";
import { TrackerSyncDatapointId } from "./tracker-sync-datapoint-id";

export const TrackerSyncDatapoint = z.object({
  id: TrackerSyncDatapointId,
  trackerId: TrackerId,
  value: TrackerValue,
  createdAt: TrackerUpdatedAt,
});
export type TrackerSyncDatapointType = z.infer<typeof TrackerSyncDatapoint>;
