import * as History from "../";

import * as infra from "../../../infra";

export class HistoryPopulator {
  static async populate(
    payload: History.Events.HistoryPopulatedEventType["payload"]
  ) {
    return infra.EventStore.save(
      History.Events.HistoryPopulatedEvent.parse({
        name: History.Events.HISTORY_POPULATED_EVENT,
        stream: "history",
        version: 1,
        payload,
      })
    );
  }

  static async clear(
    payload: History.Events.HistoryClearedEventType["payload"]
  ) {
    return infra.EventStore.save(
      History.Events.HistoryClearedEvent.parse({
        name: History.Events.HISTORY_CLEARED_EVENT,
        stream: "history",
        version: 1,
        payload,
      })
    );
  }
}
