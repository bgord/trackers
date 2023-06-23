import * as bg from "@bgord/node";
import z from "zod";

import * as VO from "./value-objects";

export const TRACKER_ADDED_EVENT = "TRACKER_ADDED_EVENT";
export const TrackerAddedEvent = bg.EventDraft.merge(
  z.object({
    name: z.literal(TRACKER_ADDED_EVENT),
    version: z.literal(1),
    payload: VO.Tracker,
  })
);
export type TrackerAddedEventType = z.infer<typeof TrackerAddedEvent>;

export const TRACKER_SYNCED_EVENT = "TRACKER_SYNCED_EVENT";
export const TrackerSyncedEvent = bg.EventDraft.merge(
  z.object({
    name: z.literal(TRACKER_SYNCED_EVENT),
    version: z.literal(1),
    payload: VO.Tracker.pick({ id: true, value: true, updatedAt: true }).merge(
      z.object({ datapointId: VO.TrackerDatapointId })
    ),
  })
);
export type TrackerSyncedEventType = z.infer<typeof TrackerSyncedEvent>;

export const TRACKER_REVERTED_EVENT = "TRACKER_REVERTED_EVENT";
export const TrackerRevertedEvent = bg.EventDraft.merge(
  z.object({
    name: z.literal(TRACKER_REVERTED_EVENT),
    version: z.literal(1),
    payload: z.object({
      id: VO.TrackerId,
      datapointId: VO.TrackerDatapointId,
      updatedAt: VO.TrackerUpdatedAt,
    }),
  })
);
export type TrackerRevertedEventType = z.infer<typeof TrackerRevertedEvent>;

export const TRACKER_DELETED_EVENT = "TRACKER_DELETED_EVENT";
export const TrackerDeletedEvent = bg.EventDraft.merge(
  z.object({
    name: z.literal(TRACKER_DELETED_EVENT),
    version: z.literal(1),
    payload: z.object({ id: VO.TrackerId }),
  })
);
export type TrackerDeletedEventType = z.infer<typeof TrackerDeletedEvent>;

export const TRACKER_EXPORTED_EVENT = "TRACKER_EXPORTED_EVENT";
export const TrackerExportedEvent = bg.EventDraft.merge(
  z.object({
    name: z.literal(TRACKER_EXPORTED_EVENT),
    version: z.literal(1),
    payload: z.object({
      id: VO.TrackerId,
      scheduledAt: bg.Schema.Timestamp,
      email: bg.Schema.Email,
      name: VO.TrackerName,
      timeZoneOffsetMs: bg.Schema.TimeZoneOffsetValue,
    }),
  })
);
export type TrackerExportedEventType = z.infer<typeof TrackerExportedEvent>;

export const TRACKER_NAME_CHANGED_EVENT = "TRACKER_NAME_CHANGED_EVENT";
export const TrackerNameChangedEvent = bg.EventDraft.merge(
  z.object({
    name: z.literal(TRACKER_NAME_CHANGED_EVENT),
    version: z.literal(1),
    payload: z.object({
      id: VO.TrackerId,
      name: VO.TrackerName,
      updatedAt: VO.TrackerUpdatedAt,
    }),
  })
);
export type TrackerNameChangedEventType = z.infer<
  typeof TrackerNameChangedEvent
>;

export const TRACKER_ARCHIVED_EVENT = "TRACKER_ARCHIVED_EVENT";
export const TrackerArchivedEvent = bg.EventDraft.merge(
  z.object({
    name: z.literal(TRACKER_ARCHIVED_EVENT),
    version: z.literal(1),
    payload: z.object({ id: VO.TrackerId, archivedAt: VO.TrackerUpdatedAt }),
  })
);
export type TrackerArchivedEventType = z.infer<typeof TrackerArchivedEvent>;

export const TRACKER_RESTORED_EVENT = "TRACKER_RESTORED_EVENT";
export const TrackerRestoredEvent = bg.EventDraft.merge(
  z.object({
    name: z.literal(TRACKER_RESTORED_EVENT),
    version: z.literal(1),
    payload: z.object({ id: VO.TrackerId, restoredAt: VO.TrackerUpdatedAt }),
  })
);
export type TrackerRestoredEventType = z.infer<typeof TrackerRestoredEvent>;

export const WEEKLY_TRACKERS_REPORT_SCHEDULED =
  "WEEKLY_TRACKERS_REPORT_SCHEDULED";
export const WeeklyTrackersReportScheduledEvent = bg.EventDraft.merge(
  z.object({
    name: z.literal(WEEKLY_TRACKERS_REPORT_SCHEDULED),
    version: z.literal(1),
    payload: z.object({
      scheduledAt: bg.Schema.Timestamp,
      email: bg.Schema.EmailTo,
    }),
  })
);
export type WeeklyTrackersReportScheduledEventype = z.infer<
  typeof WeeklyTrackersReportScheduledEvent
>;
