import { z } from "zod";

import { HistoryCreatedAt } from "./history-created-at";
import { HistoryId } from "./history-id";
import { HistoryOperation } from "./history-operation";
import { HistoryPayload } from "./history-payload";
import { HistoryRelatedTrackerId } from "./history-related-tracker-id";

export const History = z.object({
  id: HistoryId,
  createdAt: HistoryCreatedAt,
  operation: HistoryOperation,
  payload: HistoryPayload,
  relatedTrackerId: HistoryRelatedTrackerId,
});
export type HistoryType = z.infer<typeof History>;
