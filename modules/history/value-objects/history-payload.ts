import { z } from "zod";

export const HistoryPayload = z
  .record(z.any())
  .refine((value) => {
    try {
      JSON.parse(JSON.stringify(value));
      return true;
    } catch (error) {
      return false;
    }
  })
  .transform((value) => JSON.stringify(value));

export type HistoryPayloadType = z.infer<typeof HistoryPayload>;
