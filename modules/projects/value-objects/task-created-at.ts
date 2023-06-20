import * as bg from "@bgord/node";
import { z } from "zod";

export const TaskCreatedAt = bg.Schema.Timestamp.brand<"task-created-at">();

export type TaskCreatedAtType = z.infer<typeof TaskCreatedAt>;
