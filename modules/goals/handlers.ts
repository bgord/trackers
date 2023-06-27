import * as bg from "@bgord/node";

import * as infra from "../../infra";
import * as Goals from "./";
import * as Trackers from "../trackers";
import * as Settings from "../settings";

const EventHandler = new bg.EventHandler(infra.logger);

export const onGoalCreatedEventHandler =
  EventHandler.handle<Goals.Events.GoalCreatedEventType>(async (event) => {
    await Goals.Repos.GoalRepository.create(event.payload);
  });

export const onGoalDeletedEventHandler =
  EventHandler.handle<Goals.Events.GoalDeletedEventType>(async (event) => {
    await Goals.Repos.GoalRepository.delete({ id: event.payload.id });
  });

export const onGoalAccomplishedEventHandler =
  EventHandler.handle<Goals.Events.GoalAccomplishedEventType>(async (event) => {
    await Goals.Repos.GoalRepository.accomplish(event.payload);

    const settings = await new Settings.Aggregates.Settings().build();

    await Goals.Services.GoalAccomplishedNotificationScheduler.schedule(
      event,
      settings
    );
  });

export const onGoalRegressedEventHandler =
  EventHandler.handle<Goals.Events.GoalRegressedEventType>(async (event) => {
    await Goals.Repos.GoalRepository.regress(event.payload);
  });

export const onTrackerValueRecalculatedEventHandler =
  EventHandler.handle<Trackers.Events.TrackerValueRecalculatedEventType>(
    async (event) => {
      const result = await Goals.Repos.GoalRepository.getForTracker({
        relatedTrackerId: event.payload.trackerId,
      });

      if (!result) return;

      const id = Goals.VO.GoalId.parse(result.id);

      const tracker = {
        id: event.payload.trackerId,
        value: event.payload.value,
      };

      const goal = await new Goals.Aggregates.Goal(id).build();
      await goal.evaluate(tracker);
    }
  );

export const onGoalAccomplishedNotificationScheduledEventHandler =
  EventHandler.handle<Goals.Events.GoalAccomplishedNotificationScheduledEventType>(
    async (event) => {
      const { goalTarget, goalKind, trackerValue, trackerName } = event.payload;

      const goal = { target: goalTarget, kind: goalKind };
      const tracker = { value: trackerValue, name: trackerName };

      const composer = new Goals.Services.GoalAccomplishedNotificationComposer(
        goal,
        tracker
      );

      const notification = composer.compose();
      await composer.send(notification, event.payload.emailTo);
    }
  );
