import * as bg from "@bgord/node";
import { z } from "zod";

export const TrackerUpdatedAt =
  bg.Schema.Timestamp.brand<"tracker-updated-at">();

export type TrackerUpdatedAtType = z.infer<typeof TrackerUpdatedAt>;
