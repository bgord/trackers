import * as bg from "@bgord/node";
import { z } from "zod";

export const TaskId = bg.Schema.UUID.brand<"task-id">();

export type TaskIdType = z.infer<typeof TaskId>;
