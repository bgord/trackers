import * as bg from "@bgord/node";
import { z } from "zod";

export const GoalCreatedAt = bg.Schema.Timestamp.brand<"goal-created-at">();
export type GoalCreatedAtType = z.infer<typeof GoalCreatedAt>;
