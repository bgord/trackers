import * as bg from "@bgord/node";
import { z } from "zod";

import * as infra from "../infra";
import * as Events from "../events";

type AcceptedEvent =
  | typeof Events.TrackerAddedEvent
  | typeof Events.TrackerSyncedEvent
  | typeof Events.TrackerRevertedEvent
  | typeof Events.TrackerDeletedEvent
  | typeof Events.TrackerExportedEvent
  | typeof Events.TrackerNameChangedEvent
  | typeof Events.WeeklyTrackersReportEnabledEvent
  | typeof Events.WeeklyTrackersReportDisabledEvent
  | typeof Events.WeeklyTrackersReportScheduledEvent
  | typeof Events.SettingsEmailChangedEvent
  | typeof Events.SettingsEmailDeletedEvent;
type AcceptedEventType = z.infer<AcceptedEvent>;

export class EventStore {
  static async find<T extends AcceptedEvent[]>(
    acceptedEvents: T,
    stream?: bg.EventType["stream"]
  ): Promise<z.infer<T[0]>[]> {
    const acceptedEventNames = acceptedEvents.map(
      (acceptedEvent) => acceptedEvent._def.shape().name._def.value
    );

    const events = await infra.db.event.findMany({
      where: { name: { in: acceptedEventNames }, stream },
      orderBy: { createdAt: "asc" },
    });

    return events
      .map((event) => ({ ...event, payload: JSON.parse(event.payload) }))
      .map((event) => {
        const parser = acceptedEvents.find(
          (acceptedEvent) =>
            acceptedEvent._def.shape().name._def.value === event.name
        );

        if (!parser) return undefined;

        return parser.parse(event);
      })
      .filter(
        (event: z.infer<T[0]> | undefined): event is z.infer<T[0]> =>
          event !== undefined
      );
  }

  static async save(event: AcceptedEventType) {
    await infra.db.event.create({
      data: { ...event, payload: JSON.stringify(event.payload) },
    });

    Events.emittery.emit(event.name, event);
  }
}