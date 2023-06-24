import * as bg from "@bgord/node";

import * as infra from "../../infra";
import * as Goals from "./";

const EventHandler = new bg.EventHandler(infra.logger);

export const onGoalCreatedEventHandler =
  EventHandler.handle<Goals.Events.GoalCreatedEventType>(async (event) => {
    await Goals.Repos.GoalRepository.create(event.payload);
  });
