import * as bg from "@bgord/node";

import * as Repos from "./repositories";
import * as Events from "./events";

import * as infra from "../../infra";

const EventHandler = new bg.EventHandler(infra.logger);

export const onHistoryPopulatedEventHandler =
  EventHandler.handle<Events.HistoryPopulatedEventType>(async (event) => {
    await Repos.HistoryRepository.append(event.payload);
  });

export const onHistoryClearedEventHandler =
  EventHandler.handle<Events.HistoryClearedEventType>(async (event) => {
    await Repos.HistoryRepository.clear(event.payload);
  });
