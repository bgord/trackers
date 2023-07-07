import * as bg from "@bgord/node";
import { z } from "zod";

import * as VO from "./value-objects";

export const HISTORY_POPULATED_EVENT = "HISTORY_POPULATED_EVENT";
export const HistoryPopulatedEvent = bg.EventDraft.merge(
  z.object({
    name: z.literal(HISTORY_POPULATED_EVENT),
    version: z.literal(1),
    payload: VO.History.pick({
      createdAt: true,
      operation: true,
      relatedTrackerId: true,
    }).merge(z.object({ payload: z.record(z.any()) })),
  })
);
export type HistoryPopulatedEventType = z.infer<typeof HistoryPopulatedEvent>;
