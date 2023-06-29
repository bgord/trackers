import { z } from "zod";

import { TRACKER_DATAPOINT_COMMENT_MAX_LENGTH } from "./tracker-datapoint-comment-max-length";
import { TRACKER_DATAPOINT_COMMENT_STRUCTURE_ERROR_KEY } from "./tracker-datapoint-comment-structure-error-key";

export const TrackerDatapointComment = z.optional(
  z
    .string()
    .min(1, { message: TRACKER_DATAPOINT_COMMENT_STRUCTURE_ERROR_KEY })
    .max(TRACKER_DATAPOINT_COMMENT_MAX_LENGTH, {
      message: TRACKER_DATAPOINT_COMMENT_STRUCTURE_ERROR_KEY,
    })
    .brand<"tracker-comment-id">()
);

export type TrackerDatapointCommentType = z.infer<
  typeof TrackerDatapointComment
>;
