import { z } from "zod";
import { TrackerId } from "../../trackers/value-objects/tracker-id";

export const GoalRelatedTrackerId = TrackerId;
export type GoalRelatedTrackerIdType = z.infer<typeof GoalRelatedTrackerId>;
