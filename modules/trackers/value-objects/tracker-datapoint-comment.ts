import { z } from "zod";

import { TRACKER_DATAPOINT_COMMENT_MAX_LENGTH } from "./tracker-datapoint-comment-max-length";

export const TrackerDatapointComment = z.optional(
  z
    .string()
    .min(1)
    .max(TRACKER_DATAPOINT_COMMENT_MAX_LENGTH)
    .brand<"tracker-comment-id">()
);

export type TrackerDatapointCommentType = z.infer<
  typeof TrackerDatapointComment
>;
