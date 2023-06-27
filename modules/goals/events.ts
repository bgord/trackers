import * as bg from "@bgord/node";
import z from "zod";

import * as VO from "./value-objects";
import { TrackerId } from "../trackers/value-objects/tracker-id";
import { TrackerValue } from "../trackers/value-objects/tracker-value";
import { TrackerName } from "../trackers/value-objects/tracker-name";
import { SettingsEmail } from "../settings/value-objects/settings-email";

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
    payload: z.object({
      id: VO.GoalId,
      trackerId: TrackerId,
      accomplishedAt: VO.GoalUpdatedAt,
    }),
  })
);
export type GoalAccomplishedEventType = z.infer<typeof GoalAccomplishedEvent>;

export const GOAL_ACCOMPLISHED_NOTIFICATION_SCHEDULED_EVENT =
  "GOAL_ACCOMPLISHED_NOTIFICATION_SCHEDULED_EVENT";
export const GoalAccomplishedNotificationScheduledEvent = bg.EventDraft.merge(
  z.object({
    name: z.literal(GOAL_ACCOMPLISHED_NOTIFICATION_SCHEDULED_EVENT),
    version: z.literal(1),
    payload: z.object({
      goalTarget: VO.GoalTarget,
      goalKind: VO.GoalKind,
      trackerName: TrackerName,
      trackerValue: TrackerValue,
      emailTo: SettingsEmail,
    }),
  })
);
export type GoalAccomplishedNotificationScheduledEventType = z.infer<
  typeof GoalAccomplishedNotificationScheduledEvent
>;

export const GOAL_REGRESSED_EVENT = "GOAL_REGRESSED_EVENT";
export const GoalRegressedEvent = bg.EventDraft.merge(
  z.object({
    name: z.literal(GOAL_REGRESSED_EVENT),
    version: z.literal(1),
    payload: z.object({ id: VO.GoalId, regressedAt: VO.GoalUpdatedAt }),
  })
);
export type GoalRegressedEventType = z.infer<typeof GoalRegressedEvent>;
