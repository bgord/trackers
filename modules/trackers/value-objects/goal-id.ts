import * as bg from "@bgord/node";
import { z } from "zod";

export const GoalId = bg.Schema.UUID.brand<"goal-id">();

export type GoalIdType = z.infer<typeof GoalId>;
