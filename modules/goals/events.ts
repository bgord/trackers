import * as bg from "@bgord/node";
import z from "zod";

import * as VO from "./value-objects";

export const GOAL_CREATED_EVENT = "GOAL_CREATED_EVENT";
export const GoalCreatedEvent = bg.EventDraft.merge(
  z.object({
    name: z.literal(GOAL_CREATED_EVENT),
    version: z.literal(1),
    payload: VO.Goal,
  })
);
export type GoalCreatedEventType = z.infer<typeof GoalCreatedEvent>;
