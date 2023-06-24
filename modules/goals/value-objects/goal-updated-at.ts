import * as bg from "@bgord/node";
import { z } from "zod";

export const GoalUpdatedAt = bg.Schema.Timestamp.brand<"goal-updated-at">();
export type GoalUpdatedAtType = z.infer<typeof GoalUpdatedAt>;
