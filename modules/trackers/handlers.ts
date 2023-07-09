import * as bg from "@bgord/node";

import * as Trackers from "./";
import * as Goals from "../goals";
import * as History from "../history";

import * as infra from "../../infra";

const EventHandler = new bg.EventHandler(infra.logger);

export const onTrackerAddedEventHandler =
  EventHandler.handle<Trackers.Events.TrackerAddedEventType>(async (event) => {
    await History.Services.HistoryPopulator.populate({
      createdAt: event.payload.createdAt,
      operation: "history.tracker.created",
      payload: {
        name: event.payload.name,
        kind: event.payload.kind,
      },
      relatedTrackerId: event.payload.id,
    });

    await Trackers.Repos.TrackerRepository.create(event.payload);
  });

export const onTrackerSyncedEventHandler =
  EventHandler.handle<Trackers.Events.TrackerSyncedEventType>(async (event) => {
    await Trackers.Repos.TrackerRepository.sync(event.payload);
    await Trackers.Repos.DatapointRepository.add(event.payload);

    await infra.EventStore.save(
      Trackers.Events.TrackerValueRecalculatedEvent.parse({
        name: Trackers.Events.TRACKER_VALUE_RECALCULATED_EVENT,
        stream: Trackers.Aggregates.Tracker.getStream(event.payload.id),
        version: 1,
        payload: { trackerId: event.payload.id, value: event.payload.value },
      })
    );
  });

export const onTrackerRevertedEventHandler =
  EventHandler.handle<Trackers.Events.TrackerRevertedEventType>(
    async (event) => {
      await Trackers.Repos.DatapointRepository.remove({
        datapointId: event.payload.datapointId,
      });

      const latestDatapointForTracker =
        await Trackers.Repos.DatapointRepository.getLatestDatapointForTracker(
          event.payload.id
        );

      const value = Trackers.VO.TrackerValue.parse(
        latestDatapointForTracker?.value ?? Trackers.VO.TRACKER_VALUE_DEFAULT
      );

      await Trackers.Repos.TrackerRepository.sync({
        id: event.payload.id,
        value,
        updatedAt: event.payload.updatedAt,
      });

      await infra.EventStore.save(
        Trackers.Events.TrackerValueRecalculatedEvent.parse({
          name: Trackers.Events.TRACKER_VALUE_RECALCULATED_EVENT,
          stream: Trackers.Aggregates.Tracker.getStream(event.payload.id),
          version: 1,
          payload: { trackerId: event.payload.id, value },
        })
      );
    }
  );

export const onTrackerDeletedEventHandler =
  EventHandler.handle<Trackers.Events.TrackerDeletedEventType>(
    async (event) => {
      const result = await Trackers.Repos.TrackerRepository.getGoalForTracker({
        id: event.payload.id,
      });

      if (result) {
        const id = Goals.VO.GoalId.parse(result.id);

        const goal = await new Goals.Aggregates.Goal(id).build();
        await goal.delete();
      }

      await Trackers.Repos.TrackerRepository.delete({ id: event.payload.id });

      await History.Services.HistoryPopulator.clear({
        relatedTrackerId: event.payload.id,
      });
    }
  );

export const onTrackerExportedEventHandler =
  EventHandler.handle<Trackers.Events.TrackerExportedEventType>(
    async (event) => {
      await History.Services.HistoryPopulator.populate({
        createdAt: event.payload.scheduledAt,
        operation: "history.tracker.exported",
        relatedTrackerId: event.payload.id,
        payload: {},
      });

      const trackerExportFile = new Trackers.Services.TrackerExportFile({
        repos: Trackers.Repos,
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
    }
  );

export const onTrackerNameChangedEventHandler =
  EventHandler.handle<Trackers.Events.TrackerNameChangedEventType>(
    async (event) => {
      await History.Services.HistoryPopulator.populate({
        createdAt: event.payload.updatedAt,
        operation: "history.tracker.name.changed",
        relatedTrackerId: event.payload.id,
        payload: { name: event.payload.name },
      });

      await Trackers.Repos.TrackerRepository.changeName(event.payload);
    }
  );

export const onTrackerArchivedEventHandler =
  EventHandler.handle<Trackers.Events.TrackerArchivedEventType>(
    async (event) => {
      await History.Services.HistoryPopulator.populate({
        createdAt: event.payload.archivedAt,
        operation: "history.tracker.archived",
        relatedTrackerId: event.payload.id,
        payload: {},
      });

      await Trackers.Repos.TrackerRepository.archive({
        ...event.payload,
        updatedAt: event.payload.archivedAt,
      });
    }
  );

export const onTrackerRestoredEventHandler =
  EventHandler.handle<Trackers.Events.TrackerRestoredEventType>(
    async (event) => {
      await History.Services.HistoryPopulator.populate({
        createdAt: event.payload.restoredAt,
        operation: "history.tracker.restored",
        relatedTrackerId: event.payload.id,
        payload: {},
      });

      await Trackers.Repos.TrackerRepository.restore({
        ...event.payload,
        updatedAt: event.payload.restoredAt,
      });
    }
  );

export const onDatapointCommentDeletedEventHandler =
  EventHandler.handle<Trackers.Events.DatapointCommentDeletedEventType>(
    async (event) => {
      await Trackers.Repos.DatapointRepository.deleteComment({
        id: event.payload.datapointId,
      });
    }
  );

export const onDatapointCommentUpdatedEventHandler =
  EventHandler.handle<Trackers.Events.DatapointCommentUpdatedEventType>(
    async (event) => {
      await Trackers.Repos.DatapointRepository.updateComment({
        id: event.payload.datapointId,
        comment: event.payload.comment,
      });
    }
  );

export const onWeeklyTrackersReportScheduledEventHandler =
  EventHandler.handle<Trackers.Events.WeeklyTrackersReportScheduledEventType>(
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
