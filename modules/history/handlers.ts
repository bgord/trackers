import * as bg from "@bgord/node";

import * as infra from "../../infra";

import * as Trackers from "../trackers";
import * as History from "../history";

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
