import * as bg from "@bgord/node";
import { z } from "zod";

export const TrackerCreatedAt =
  bg.Schema.Timestamp.brand<"tracker-created-at">();

export type TrackerCreatedAtType = z.infer<typeof TrackerCreatedAt>;
