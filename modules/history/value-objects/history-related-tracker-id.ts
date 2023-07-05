import { z } from "zod";
import { TrackerId } from "../../trackers/value-objects/tracker-id";

export const HistoryRelatedTrackerId = TrackerId;
export type HistoryRelatedTrackerIdType = z.infer<
  typeof HistoryRelatedTrackerId
>;
