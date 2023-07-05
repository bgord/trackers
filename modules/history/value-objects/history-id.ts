import * as bg from "@bgord/node";
import { z } from "zod";

export const HistoryId = bg.Schema.UUID.brand<"history-id">();

export type HistoryIdType = z.infer<typeof HistoryId>;
