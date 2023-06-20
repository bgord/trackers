import * as bg from "@bgord/node";
import Emittery from "emittery";

import * as Trackers from "./modules/trackers";
import * as Settings from "./modules/settings";
import * as Projects from "./modules/projects";

import * as infra from "./infra";

const EventHandler = new bg.EventHandler(infra.logger);
const EventLogger = new bg.EventLogger(infra.logger);

export const emittery = new Emittery<{
  TRACKER_ADDED_EVENT: Trackers.Events.TrackerAddedEventType;
  TRACKER_SYNCED_EVENT: Trackers.Events.TrackerSyncedEventType;
  TRACKER_REVERTED_EVENT: Trackers.Events.TrackerRevertedEventType;
  TRACKER_DELETED_EVENT: Trackers.Events.TrackerDeletedEventType;
  TRACKER_EXPORTED_EVENT: Trackers.Events.TrackerExportedEventType;
  TRACKER_NAME_CHANGED_EVENT: Trackers.Events.TrackerNameChangedEventType;
  WEEKLY_TRACKERS_REPORT_SCHEDULED: Trackers.Events.WeeklyTrackersReportScheduledEventype;

  WEEKLY_TRACKERS_REPORT_ENABLED: Settings.Events.WeeklyTrackersReportEnabledEventType;
  WEEKLY_TRACKERS_REPORT_DISABLED: Settings.Events.WeeklyTrackersReportDisabledEventType;
  SETTINGS_EMAIL_CHANGED: Settings.Events.SettingsEmailChangedEventType;
  SETTINGS_EMAIL_DELETED: Settings.Events.SettingsEmailDeletedEventType;

  PROJECT_CREATED_EVENT: Projects.Events.ProjectCreatedEventType;
  PROJECT_DELETED_EVENT: Projects.Events.ProjectDeletedEventType;
  PROJECT_ARCHIVED_EVENT: Projects.Events.ProjectArchivedEventType;
  PROJECT_RESTORED_EVENT: Projects.Events.ProjectRestoredEventType;

  TASK_CREATED_EVENT: Projects.Events.TaskCreatedEventType;
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

emittery.on(
  Projects.Events.PROJECT_CREATED_EVENT,
  EventHandler.handle(async (event) => {
    await Projects.Repos.ProjectRepository.create(event.payload);
  })
);

emittery.on(
  Projects.Events.PROJECT_DELETED_EVENT,
  EventHandler.handle(async (event) => {
    await Projects.Repos.ProjectRepository.delete(event.payload);
  })
);

emittery.on(
  Projects.Events.PROJECT_ARCHIVED_EVENT,
  EventHandler.handle(async (event) => {
    await Projects.Repos.ProjectRepository.archive({
      id: event.payload.id,
      updatedAt: event.payload.archivedAt,
    });
  })
);

emittery.on(
  Projects.Events.PROJECT_RESTORED_EVENT,
  EventHandler.handle(async (event) => {
    await Projects.Repos.ProjectRepository.restore({
      id: event.payload.id,
      updatedAt: event.payload.restoredAt,
    });
  })
);

emittery.on(
  Projects.Events.TASK_CREATED_EVENT,
  EventHandler.handle(async (event) => {
    await Projects.Repos.TaskRepository.create(event.payload);
  })
);
