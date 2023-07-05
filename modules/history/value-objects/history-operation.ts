import { z } from "zod";

export const HistoryOperation = z.string().min(1);
export type HistoryOperationType = z.infer<typeof HistoryOperation>;
