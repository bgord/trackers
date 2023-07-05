import * as bg from "@bgord/node";

import * as infra from "../../infra";

import * as Trackers from "../trackers";
import * as History from "../history";
import * as Goals from "../goals";

const EventHandler = new bg.EventHandler(infra.logger);

export const onTrackerAddedEventHandler =
  EventHandler.handle<Trackers.Events.TrackerAddedEventType>(async (event) => {
    await History.Repos.HistoryRepository.append({
      createdAt: event.payload.createdAt,
      operation: "history.tracker.created",
      payload: {
        name: event.payload.name,
        kind: event.payload.kind,
      },
      relatedTrackerId: event.payload.id,
    });
  });

export const onTrackerArchivedEventHandler =
  EventHandler.handle<Trackers.Events.TrackerArchivedEventType>(
    async (event) => {
      await History.Repos.HistoryRepository.append({
        createdAt: event.payload.archivedAt,
        operation: "history.tracker.archived",
        relatedTrackerId: event.payload.id,
        payload: {},
      });
    }
  );

export const onTrackerRestoredEventHandler =
  EventHandler.handle<Trackers.Events.TrackerRestoredEventType>(
    async (event) => {
      await History.Repos.HistoryRepository.append({
        createdAt: event.payload.restoredAt,
        operation: "history.tracker.restored",
        relatedTrackerId: event.payload.id,
        payload: {},
      });
    }
  );

export const onTrackerExportedEventHandler =
  EventHandler.handle<Trackers.Events.TrackerExportedEventType>(
    async (event) => {
      await History.Repos.HistoryRepository.append({
        createdAt: event.payload.scheduledAt,
        operation: "history.tracker.exported",
        relatedTrackerId: event.payload.id,
        payload: {},
      });
    }
  );

export const onTrackerNameChangedEventHandler =
  EventHandler.handle<Trackers.Events.TrackerNameChangedEventType>(
    async (event) => {
      await History.Repos.HistoryRepository.append({
        createdAt: event.payload.updatedAt,
        operation: "history.tracker.name.changed",
        relatedTrackerId: event.payload.id,
        payload: { name: event.payload.name },
      });
    }
  );

export const onTrackerValueRecalculatedEventHandler =
  EventHandler.handle<Trackers.Events.TrackerValueRecalculatedEventType>(
    async (event) => {
      await History.Repos.HistoryRepository.append({
        createdAt: Date.now(),
        operation: "history.tracker.recalculated",
        relatedTrackerId: event.payload.trackerId,
        payload: { value: event.payload.value },
      });
    }
  );

export const onGoalCreatedEventHandler =
  EventHandler.handle<Goals.Events.GoalCreatedEventType>(async (event) => {
    await History.Repos.HistoryRepository.append({
      createdAt: event.payload.createdAt,
      operation: "history.goal.created",
      relatedTrackerId: event.payload.relatedTrackerId,
      payload: { target: event.payload.target, kind: event.payload.kind },
    });
  });

export const onGoalDeletedEventHandler =
  EventHandler.handle<Goals.Events.GoalDeletedEventType>(async (event) => {
    await History.Repos.HistoryRepository.append({
      createdAt: event.payload.deletedAt,
      operation: "history.goal.deleted",
      relatedTrackerId: event.payload.relatedTrackerId,
      payload: { target: event.payload.target, kind: event.payload.kind },
    });
  });

export const onGoalAccomplishedEventHandler =
  EventHandler.handle<Goals.Events.GoalAccomplishedEventType>(async (event) => {
    await History.Repos.HistoryRepository.append({
      createdAt: event.payload.accomplishedAt,
      operation: "history.goal.accomplished",
      relatedTrackerId: event.payload.trackerId,
      payload: {},
    });
  });

export const onGoalRegressedEventHandler =
  EventHandler.handle<Goals.Events.GoalRegressedEventType>(async (event) => {
    await History.Repos.HistoryRepository.append({
      createdAt: event.payload.regressedAt,
      operation: "history.goal.regressed",
      relatedTrackerId: event.payload.relatedTrackerId,
      payload: {},
    });
  });
