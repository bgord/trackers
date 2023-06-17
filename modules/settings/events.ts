import * as bg from "@bgord/node";
import z from "zod";

import * as VO from "./value-objects";

export const SETTINGS_EMAIL_CHANGED = "SETTINGS_EMAIL_CHANGED";
export const SettingsEmailChangedEvent = bg.EventDraft.merge(
  z.object({
    name: z.literal(SETTINGS_EMAIL_CHANGED),
    version: z.literal(1),
    payload: z.object({
      email: VO.SettingsEmail,
      updatedAt: bg.Schema.Timestamp,
    }),
  })
);
export type SettingsEmailChangedEventType = z.infer<
  typeof SettingsEmailChangedEvent
>;

export const SETTINGS_EMAIL_DELETED = "SETTINGS_EMAIL_DELETED";
export const SettingsEmailDeletedEvent = bg.EventDraft.merge(
  z.object({
    name: z.literal(SETTINGS_EMAIL_DELETED),
    version: z.literal(1),
    payload: z.object({ updatedAt: bg.Schema.Timestamp }),
  })
);
export type SettingsEmailDeletedEventType = z.infer<
  typeof SettingsEmailDeletedEvent
>;

export const WEEKLY_TRACKERS_REPORT_ENABLED = "WEEKLY_TRACKERS_REPORT_ENABLED";
export const WeeklyTrackersReportEnabledEvent = bg.EventDraft.merge(
  z.object({
    name: z.literal(WEEKLY_TRACKERS_REPORT_ENABLED),
    version: z.literal(1),
    payload: z.object({ updatedAt: bg.Schema.Timestamp }),
  })
);
export type WeeklyTrackersReportEnabledEventType = z.infer<
  typeof WeeklyTrackersReportEnabledEvent
>;

export const WEEKLY_TRACKERS_REPORT_DISABLED =
  "WEEKLY_TRACKERS_REPORT_DISABLED";
export const WeeklyTrackersReportDisabledEvent = bg.EventDraft.merge(
  z.object({
    name: z.literal(WEEKLY_TRACKERS_REPORT_DISABLED),
    version: z.literal(1),
    payload: z.object({ updatedAt: bg.Schema.Timestamp }),
  })
);
export type WeeklyTrackersReportDisabledEventType = z.infer<
  typeof WeeklyTrackersReportDisabledEvent
>;
