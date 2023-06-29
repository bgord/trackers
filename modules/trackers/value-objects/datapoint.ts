import z from "zod";

import { TrackerValue } from "./tracker-value";
import { TrackerUpdatedAt } from "./tracker-updated-at";
import { TrackerId } from "./tracker-id";
import { DatapointId } from "./datapoint-id";
import { DatapointComment } from "./datapoint-comment";

export const Datapoint = z.object({
  id: DatapointId,
  trackerId: TrackerId,
  value: TrackerValue,
  createdAt: TrackerUpdatedAt,
  comment: DatapointComment,
});
export type DatapointType = z.infer<typeof Datapoint>;
