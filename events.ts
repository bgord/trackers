import * as bg from "@bgord/node";
import z from "zod";
import Emittery from "emittery";

import * as VO from "./value-objects";
import * as Repos from "./repositories";
import * as Services from "./services";
import * as infra from "./infra";

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
    }),
  })
);
export type TrackerExportedEventType = z.infer<typeof TrackerExportedEvent>;

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

export const WEEKLY_TRACKERS_REPORT_SCHEDULED =
  "WEEKLY_TRACKERS_REPORT_SCHEDULED";
export const WeeklyTrackersReportScheduledEvent = bg.EventDraft.merge(
  z.object({
    name: z.literal(WEEKLY_TRACKERS_REPORT_SCHEDULED),
    version: z.literal(1),
    payload: z.object({ scheduledAt: bg.Schema.Timestamp }),
  })
);
export type WeeklyTrackersReportScheduledEventype = z.infer<
  typeof WeeklyTrackersReportScheduledEvent
>;

export const SETTINGS_EMAIL_CHANGED = "SETTINGS_EMAIL_CHANGED";
export const SettingsEmailChangedEvent = bg.EventDraft.merge(
  z.object({
    name: z.literal(SETTINGS_EMAIL_CHANGED),
    version: z.literal(1),
    payload: z.object({ email: VO.SettingsEmail }),
  })
);
export type SettingsEmailChangedEventEvenType = z.infer<
  typeof SettingsEmailChangedEvent
>;

Emittery.isDebugEnabled = true;

export const emittery = new Emittery<{
  TRACKER_ADDED_EVENT: TrackerAddedEventType;
  TRACKER_SYNCED_EVENT: TrackerSyncedEventType;
  TRACKER_REVERTED_EVENT: TrackerRevertedEventType;
  TRACKER_DELETED_EVENT: TrackerDeletedEventType;
  TRACKER_EXPORTED_EVENT: TrackerExportedEventType;

  WEEKLY_TRACKERS_REPORT_ENABLED: WeeklyTrackersReportEnabledEventType;
  WEEKLY_TRACKERS_REPORT_DISABLED: WeeklyTrackersReportDisabledEventType;

  WEEKLY_TRACKERS_REPORT_SCHEDULED: WeeklyTrackersReportScheduledEventype;
  SETTINGS_EMAIL_CHANGED: SettingsEmailChangedEventEvenType;
}>();

emittery.on(TRACKER_ADDED_EVENT, async (event) => {
  await Repos.TrackerRepository.create(event.payload);
});

emittery.on(TRACKER_SYNCED_EVENT, async (event) => {
  await Repos.TrackerRepository.sync(event.payload);
  await Repos.TrackerDatapointRepository.add(event.payload);
});

emittery.on(TRACKER_REVERTED_EVENT, async (event) => {
  await Repos.TrackerDatapointRepository.remove({
    datapointId: event.payload.datapointId,
  });

  const latestDatapointForTracker =
    await Repos.TrackerDatapointRepository.getLatestDatapointForTracker(
      event.payload.id
    );

  await Repos.TrackerRepository.sync({
    id: event.payload.id,
    value: VO.TrackerValue.parse(
      latestDatapointForTracker?.value ?? VO.DEFAULT_TRACKER_VALUE
    ),
    updatedAt: event.payload.updatedAt,
  });
});

emittery.on(TRACKER_DELETED_EVENT, async (event) => {
  await Repos.TrackerRepository.delete({ id: event.payload.id });
});

emittery.on(TRACKER_EXPORTED_EVENT, async (event) => {
  const trackerExportFile = new Services.TrackerExportFile({
    repository: Repos.TrackerDatapointRepository,
    ...event.payload,
  });

  try {
    const attachment = await trackerExportFile.generate();

    await Services.TrackerExportSender.send({ attachment, ...event.payload });

    await trackerExportFile.delete();
  } catch (error) {
    infra.logger.error({
      message: "TRACKER_EXPORTED_EVENT error",
      operation: "tracker_exported_event_error",
      metadata: infra.logger.formatError(error as Error),
    });
    await trackerExportFile.delete();
  }
});

emittery.on(WEEKLY_TRACKERS_REPORT_SCHEDULED, async (event) => {
  const weeklyTrackersReportGenerator =
    new Services.WeeklyTrackersReportGenerator({
      repos: {
        tracker: Repos.TrackerRepository,
        datapoint: Repos.TrackerDatapointRepository,
      },
      ...event.payload,
    });

  const report = await weeklyTrackersReportGenerator.generate();

  await Services.WeeklyTrackersReportSender.send({ content: report });
});
