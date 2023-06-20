import * as bg from "@bgord/node";
import { z } from "zod";

export const TaskUpdatedAt = bg.Schema.Timestamp.brand<"task-updated-at">();

export type TaskUpdatedAtType = z.infer<typeof TaskUpdatedAt>;
