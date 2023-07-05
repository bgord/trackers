import * as bg from "@bgord/node";
import { z } from "zod";

export const HistoryCreatedAt =
  bg.Schema.Timestamp.brand<"history-created-at">();
export type HistoryCreatedAtType = z.infer<typeof HistoryCreatedAt>;
