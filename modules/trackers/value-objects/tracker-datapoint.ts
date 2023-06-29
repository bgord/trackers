import z from "zod";

import { TrackerValue } from "./tracker-value";
import { TrackerUpdatedAt } from "./tracker-updated-at";
import { TrackerId } from "./tracker-id";
import { TrackerDatapointId } from "./tracker-datapoint-id";
import { TrackerDatapointComment } from "./tracker-datapoint-comment";

export const TrackerDatapoint = z.object({
  id: TrackerDatapointId,
  trackerId: TrackerId,
  value: TrackerValue,
  createdAt: TrackerUpdatedAt,
  comment: TrackerDatapointComment,
});
export type TrackerDatapointType = z.infer<typeof TrackerDatapoint>;
