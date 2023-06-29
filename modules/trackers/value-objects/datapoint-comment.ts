import { z } from "zod";

import { DATAPOINT_COMMENT_MAX_LENGTH } from "./datapoint-comment-max-length";
import { DATAPOINT_COMMENT_STRUCTURE_ERROR_KEY } from "./datapoint-comment-structure-error-key";

export const DatapointComment = z.optional(
  z
    .string()
    .min(1, { message: DATAPOINT_COMMENT_STRUCTURE_ERROR_KEY })
    .max(DATAPOINT_COMMENT_MAX_LENGTH, {
      message: DATAPOINT_COMMENT_STRUCTURE_ERROR_KEY,
    })
    .brand<"datapoint-comment">()
);

export type DatapointCommentType = z.infer<typeof DatapointComment>;
