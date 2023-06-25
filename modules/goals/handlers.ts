import * as bg from "@bgord/node";

import * as infra from "../../infra";
import * as Goals from "./";
import * as Trackers from "../trackers";

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
  });

export const onTrackerValueRecalculatedEventHandler =
  EventHandler.handle<Trackers.Events.TrackerValueRecalculatedEventType>(
    async (event) => {
      const result = await Goals.Repos.GoalRepository.getForTracker({
        relatedTrackerId: event.payload.trackerId,
      });

      if (!result) return;

      const id = Goals.VO.GoalId.parse(result.id);

      const goal = await new Goals.Aggregates.Goal(id).build();
      await goal.evaluate(event.payload.value);
    }
  );
