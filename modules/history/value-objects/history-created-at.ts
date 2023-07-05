import * as bg from "@bgord/node";
import { z } from "zod";

export const HistoryCreatedAt = bg.Schema.Timestamp;
export type HistoryCreatedAtType = z.infer<typeof HistoryCreatedAt>;
