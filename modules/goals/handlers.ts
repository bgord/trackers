import * as bg from "@bgord/node";

import * as infra from "../../infra";
import * as Goals from "./";

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
