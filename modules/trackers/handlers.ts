import * as bg from "@bgord/node";

import * as infra from "../../infra";
import * as Events from "./events";
import * as Trackers from "./";

const EventHandler = new bg.EventHandler(infra.logger);

export const onTrackerAddedEventHandler =
  EventHandler.handle<Events.TrackerAddedEventType>(async (event) => {
    await Trackers.Repos.TrackerRepository.create(event.payload);
  });

export const onTrackerSyncedEventHandler =
  EventHandler.handle<Events.TrackerSyncedEventType>(async (event) => {
    await Trackers.Repos.TrackerRepository.sync(event.payload);
    await Trackers.Repos.TrackerDatapointRepository.add(event.payload);
  });

export const onTrackerRevertedEventHandler =
  EventHandler.handle<Events.TrackerRevertedEventType>(async (event) => {
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
  });

export const onTrackerDeletedEventHandler =
  EventHandler.handle<Events.TrackerDeletedEventType>(async (event) => {
    await Trackers.Repos.TrackerRepository.delete({ id: event.payload.id });
  });

export const onTrackerExportedEventHandler =
  EventHandler.handle<Events.TrackerExportedEventType>(async (event) => {
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
  });

export const onTrackerNameChangedEventHandler =
  EventHandler.handle<Events.TrackerNameChangedEventType>(async (event) => {
    await Trackers.Repos.TrackerRepository.changeName(event.payload);
  });

export const onTrackerArchivedEventHandler =
  EventHandler.handle<Events.TrackerArchivedEventType>(async (event) => {
    await Trackers.Repos.TrackerRepository.archive({
      ...event.payload,
      updatedAt: event.payload.archivedAt,
    });
  });

export const onTrackerRestoredEventHandler =
  EventHandler.handle<Events.TrackerRestoredEventType>(async (event) => {
    await Trackers.Repos.TrackerRepository.restore({
      ...event.payload,
      updatedAt: event.payload.restoredAt,
    });
  });

export const onWeeklyTrackersReportScheduledEventHandler =
  EventHandler.handle<Events.WeeklyTrackersReportScheduledEventType>(
    async (event) => {
      const { scheduledAt, email } = event.payload;

      const config = {
        repos: {
          tracker: Trackers.Repos.TrackerRepository,
          datapoint: Trackers.Repos.TrackerDatapointRepository,
        },
        scheduledAt,
      };

      const reportGenerator =
        new Trackers.Services.WeeklyTrackersReportGenerator(config);
      const report = await reportGenerator.generate();

      await infra.Mailer.send({
        ...report,
        from: infra.Env.EMAIL_FROM,
        to: email,
      });
    }
  );