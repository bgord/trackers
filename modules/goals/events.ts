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

export const GOAL_DELETED_EVENT = "GOAL_DELETED_EVENT";
export const GoalDeletedEvent = bg.EventDraft.merge(
  z.object({
    name: z.literal(GOAL_DELETED_EVENT),
    version: z.literal(1),
    payload: z.object({ id: VO.GoalId, deletedAt: VO.GoalUpdatedAt }),
  })
);
export type GoalDeletedEventType = z.infer<typeof GoalDeletedEvent>;

export const GOAL_ACCOMPLISHED_EVENT = "GOAL_ACCOMPLISHED_EVENT";
export const GoalAccomplishedEvent = bg.EventDraft.merge(
  z.object({
    name: z.literal(GOAL_ACCOMPLISHED_EVENT),
    version: z.literal(1),
    payload: z.object({ id: VO.GoalId, accomplishedAt: VO.GoalUpdatedAt }),
  })
);
export type GoalAccomplishedEventType = z.infer<typeof GoalAccomplishedEvent>;

export const GOAL_REGRESSED_EVENT = "GOAL_REGRESSED_EVENT";
export const GoalRegressedEvent = bg.EventDraft.merge(
  z.object({
    name: z.literal(GOAL_REGRESSED_EVENT),
    version: z.literal(1),
    payload: z.object({ id: VO.GoalId, regressedAt: VO.GoalUpdatedAt }),
  })
);
export type GoalRegressedEventType = z.infer<typeof GoalRegressedEvent>;
