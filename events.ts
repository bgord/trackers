import * as bg from "@bgord/node";
import z from "zod";
import Emittery from "emittery";

import * as VO from "./value-objects";
import * as Repos from "./repositories";
import * as Services from "./services";
import * as infra from "./infra";

const EventHandler = new bg.EventHandler(infra.logger);

const EventLogger = new bg.EventLogger(infra.logger);

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
    payload: z.object({
      scheduledAt: bg.Schema.Timestamp,
      email: bg.Schema.EmailTo,
    }),
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

export const emittery = new Emittery<{
  TRACKER_ADDED_EVENT: TrackerAddedEventType;
  TRACKER_SYNCED_EVENT: TrackerSyncedEventType;
  TRACKER_REVERTED_EVENT: TrackerRevertedEventType;
  TRACKER_DELETED_EVENT: TrackerDeletedEventType;
  TRACKER_EXPORTED_EVENT: TrackerExportedEventType;
  TRACKER_NAME_CHANGED_EVENT: TrackerNameChangedEventType;

  WEEKLY_TRACKERS_REPORT_ENABLED: WeeklyTrackersReportEnabledEventType;
  WEEKLY_TRACKERS_REPORT_DISABLED: WeeklyTrackersReportDisabledEventType;

  WEEKLY_TRACKERS_REPORT_SCHEDULED: WeeklyTrackersReportScheduledEventype;

  SETTINGS_EMAIL_CHANGED: SettingsEmailChangedEventType;
  SETTINGS_EMAIL_DELETED: SettingsEmailDeletedEventType;
}>({
  debug: { enabled: true, name: "infra/logger", logger: EventLogger.handle },
});

emittery.on(
  TRACKER_ADDED_EVENT,
  EventHandler.handle(async (event) => {
    await Repos.TrackerRepository.create(event.payload);
  })
);

emittery.on(
  TRACKER_SYNCED_EVENT,
  EventHandler.handle(async (event) => {
    await Repos.TrackerRepository.sync(event.payload);
    await Repos.TrackerDatapointRepository.add(event.payload);
  })
);

emittery.on(
  TRACKER_REVERTED_EVENT,
  EventHandler.handle(async (event) => {
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
  })
);

emittery.on(
  TRACKER_DELETED_EVENT,
  EventHandler.handle(async (event) => {
    await Repos.TrackerRepository.delete({ id: event.payload.id });
  })
);

emittery.on(
  TRACKER_EXPORTED_EVENT,
  EventHandler.handle(async (event) => {
    const { id, scheduledAt, email, name, timeZoneOffsetMs } = event.payload;

    const trackerExportFile = new Services.TrackerExportFile({
      repository: Repos.TrackerDatapointRepository,
      tracker: { id, scheduledAt },
    });

    try {
      const attachment = await trackerExportFile.generate();
      const date = bg.TimeZoneOffset.adjustDate(scheduledAt, timeZoneOffsetMs);

      await infra.Mailer.send({
        from: infra.Env.EMAIL_FROM,
        to: email,
        subject: `"${name}" tracker export file from ${date.toUTCString()}`,
        text: "See the attachment below.",
        attachments: [attachment],
      });

      await trackerExportFile.delete();
    } catch (error) {
      infra.logger.error({
        message: "TRACKER_EXPORTED_EVENT error",
        operation: "tracker_exported_event_error",
        metadata: infra.logger.formatError(error as Error),
      });

      await trackerExportFile.delete();
    }
  })
);

emittery.on(
  TRACKER_NAME_CHANGED_EVENT,
  EventHandler.handle(async (event) => {
    await Repos.TrackerRepository.changeName(event.payload);
  })
);

emittery.on(
  WEEKLY_TRACKERS_REPORT_SCHEDULED,
  EventHandler.handle(async (event) => {
    const { scheduledAt, email } = event.payload;

    const config = {
      repos: {
        tracker: Repos.TrackerRepository,
        datapoint: Repos.TrackerDatapointRepository,
      },
      scheduledAt,
    };

    const reportGenerator = new Services.WeeklyTrackersReportGenerator(config);
    const report = await reportGenerator.generate();

    await infra.Mailer.send({
      ...report,
      from: infra.Env.EMAIL_FROM,
      to: email,
    });
  })
);
