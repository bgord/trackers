import * as bg from "@bgord/node";
import z from "zod";
import Emittery from "emittery";

import { SettingsEmail } from "./modules/settings/value-objects/settings-email";
import * as Trackers from "./modules/trackers";

import * as infra from "./infra";

const EventHandler = new bg.EventHandler(infra.logger);
const EventLogger = new bg.EventLogger(infra.logger);

export const SETTINGS_EMAIL_CHANGED = "SETTINGS_EMAIL_CHANGED";
export const SettingsEmailChangedEvent = bg.EventDraft.merge(
  z.object({
    name: z.literal(SETTINGS_EMAIL_CHANGED),
    version: z.literal(1),
    payload: z.object({
      email: SettingsEmail,
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

export const emittery = new Emittery<{
  TRACKER_ADDED_EVENT: Trackers.Events.TrackerAddedEventType;
  TRACKER_SYNCED_EVENT: Trackers.Events.TrackerSyncedEventType;
  TRACKER_REVERTED_EVENT: Trackers.Events.TrackerRevertedEventType;
  TRACKER_DELETED_EVENT: Trackers.Events.TrackerDeletedEventType;
  TRACKER_EXPORTED_EVENT: Trackers.Events.TrackerExportedEventType;
  TRACKER_NAME_CHANGED_EVENT: Trackers.Events.TrackerNameChangedEventType;
  WEEKLY_TRACKERS_REPORT_SCHEDULED: Trackers.Events.WeeklyTrackersReportScheduledEventype;

  WEEKLY_TRACKERS_REPORT_ENABLED: WeeklyTrackersReportEnabledEventType;
  WEEKLY_TRACKERS_REPORT_DISABLED: WeeklyTrackersReportDisabledEventType;
  SETTINGS_EMAIL_CHANGED: SettingsEmailChangedEventType;
  SETTINGS_EMAIL_DELETED: SettingsEmailDeletedEventType;
}>({
  debug: { enabled: true, name: "infra/logger", logger: EventLogger.handle },
});

emittery.on(
  Trackers.Events.TRACKER_ADDED_EVENT,
  EventHandler.handle(async (event) => {
    await Trackers.Repos.TrackerRepository.create(event.payload);
  })
);

emittery.on(
  Trackers.Events.TRACKER_SYNCED_EVENT,
  EventHandler.handle(async (event) => {
    await Trackers.Repos.TrackerRepository.sync(event.payload);
    await Trackers.Repos.TrackerDatapointRepository.add(event.payload);
  })
);

emittery.on(
  Trackers.Events.TRACKER_REVERTED_EVENT,
  EventHandler.handle(async (event) => {
    await Trackers.Repos.TrackerDatapointRepository.remove({
      datapointId: event.payload.datapointId,
    });

    const latestDatapointForTracker =
      await Trackers.Repos.TrackerDatapointRepository.getLatestDatapointForTracker(
        event.payload.id
      );

    await Trackers.Repos.TrackerRepository.sync({
      id: event.payload.id,
      value: Trackers.VO.TrackerValue.parse(
        latestDatapointForTracker?.value ?? Trackers.VO.DEFAULT_TRACKER_VALUE
      ),
      updatedAt: event.payload.updatedAt,
    });
  })
);

emittery.on(
  Trackers.Events.TRACKER_DELETED_EVENT,
  EventHandler.handle(async (event) => {
    await Trackers.Repos.TrackerRepository.delete({ id: event.payload.id });
  })
);

emittery.on(
  Trackers.Events.TRACKER_EXPORTED_EVENT,
  EventHandler.handle(async (event) => {
    const trackerExportFile = new Trackers.Services.TrackerExportFile({
      repository: Trackers.Repos.TrackerDatapointRepository,
      tracker: event.payload,
    });

    try {
      const attachment = await trackerExportFile.generate();

      await infra.Mailer.send({
        from: infra.Env.EMAIL_FROM,
        to: event.payload.email,
        subject: attachment.subject,
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
  Trackers.Events.TRACKER_NAME_CHANGED_EVENT,
  EventHandler.handle(async (event) => {
    await Trackers.Repos.TrackerRepository.changeName(event.payload);
  })
);

emittery.on(
  Trackers.Events.WEEKLY_TRACKERS_REPORT_SCHEDULED,
  EventHandler.handle(async (event) => {
    const { scheduledAt, email } = event.payload;

    const config = {
      repos: {
        tracker: Trackers.Repos.TrackerRepository,
        datapoint: Trackers.Repos.TrackerDatapointRepository,
      },
      scheduledAt,
    };

    const reportGenerator = new Trackers.Services.WeeklyTrackersReportGenerator(
      config
    );
    const report = await reportGenerator.generate();

    await infra.Mailer.send({
      ...report,
      from: infra.Env.EMAIL_FROM,
      to: email,
    });
  })
);
