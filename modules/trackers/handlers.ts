import * as bg from "@bgord/node";

import * as infra from "../../infra";
import * as Events from "./events";

import * as Trackers from "./";
import * as Goals from "../goals";

const EventHandler = new bg.EventHandler(infra.logger);

export const onTrackerAddedEventHandler =
  EventHandler.handle<Events.TrackerAddedEventType>(async (event) => {
    await Trackers.Repos.TrackerRepository.create(event.payload);
  });

export const onTrackerSyncedEventHandler =
  EventHandler.handle<Events.TrackerSyncedEventType>(async (event) => {
    await Trackers.Repos.TrackerRepository.sync(event.payload);
    await Trackers.Repos.DatapointRepository.add(event.payload);

    await infra.EventStore.save(
      Events.TrackerValueRecalculatedEvent.parse({
        name: Events.TRACKER_VALUE_RECALCULATED_EVENT,
        stream: Trackers.Aggregates.Tracker.getStream(event.payload.id),
        version: 1,
        payload: { trackerId: event.payload.id, value: event.payload.value },
      })
    );
  });

export const onTrackerRevertedEventHandler =
  EventHandler.handle<Events.TrackerRevertedEventType>(async (event) => {
    await Trackers.Repos.DatapointRepository.remove({
      datapointId: event.payload.datapointId,
    });

    const latestDatapointForTracker =
      await Trackers.Repos.DatapointRepository.getLatestDatapointForTracker(
        event.payload.id
      );

    const value = Trackers.VO.TrackerValue.parse(
      latestDatapointForTracker?.value ?? Trackers.VO.DEFAULT_TRACKER_VALUE
    );

    await Trackers.Repos.TrackerRepository.sync({
      id: event.payload.id,
      value,
      updatedAt: event.payload.updatedAt,
    });

    await infra.EventStore.save(
      Events.TrackerValueRecalculatedEvent.parse({
        name: Events.TRACKER_VALUE_RECALCULATED_EVENT,
        stream: Trackers.Aggregates.Tracker.getStream(event.payload.id),
        version: 1,
        payload: { trackerId: event.payload.id, value },
      })
    );
  });

export const onTrackerDeletedEventHandler =
  EventHandler.handle<Events.TrackerDeletedEventType>(async (event) => {
    const result = await Trackers.Repos.TrackerRepository.getGoalForTracker({
      id: event.payload.id,
    });

    if (result) {
      const id = Goals.VO.GoalId.parse(result.id);

      await infra.EventStore.save(
        Goals.Events.GoalDeletedEvent.parse({
          name: Goals.Events.GOAL_DELETED_EVENT,
          stream: Goals.Aggregates.Goal.getStream(id),
          version: 1,
          payload: { id },
        })
      );
    }

    await Trackers.Repos.TrackerRepository.delete({ id: event.payload.id });
  });

export const onTrackerExportedEventHandler =
  EventHandler.handle<Events.TrackerExportedEventType>(async (event) => {
    const trackerExportFile = new Trackers.Services.TrackerExportFile({
      repository: Trackers.Repos.DatapointRepository,
      tracker: event.payload,
    });

    const attachment = await trackerExportFile.generate();

    await infra.Mailer.send({
      from: infra.Env.EMAIL_FROM,
      to: event.payload.email,
      subject: attachment.subject,
      text: "See the attachment below.",
      attachments: [attachment],
    });

    await trackerExportFile.delete();
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
          datapoint: Trackers.Repos.DatapointRepository,
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
