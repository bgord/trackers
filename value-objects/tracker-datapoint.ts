import z from "zod";

import { TrackerValue } from "./tracker-value";
import { TrackerUpdatedAt } from "./tracker-updated-at";
import { TrackerId } from "./tracker-id";
import { TrackerDatapointId } from "./tracker-datapoint-id";

export const TrackerDatapoint = z.object({
  id: TrackerDatapointId,
  trackerId: TrackerId,
  value: TrackerValue,
  createdAt: TrackerUpdatedAt,
});
export type TrackerDatapointType = z.infer<typeof TrackerDatapoint>;
