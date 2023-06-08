import * as bg from "@bgord/node";
import z from "zod";
import Emittery from "emittery";

import * as VO from "./value-objects";
import * as Repos from "./repositories";

export const TRACKER_ADDED_EVENT = "TRACKER_ADDED_EVENT";
export const TrackerAddedEvent = bg.EventDraft.merge(
  z.object({
    name: z.literal(TRACKER_ADDED_EVENT),
    version: z.literal(1),
    payload: VO.Tracker,
  })
);
export type TrackerAddedEventType = z.infer<typeof TrackerAddedEvent>;

export const TRACKER_SYNCED_EVENT = "TRACKER_SYNCED_EVENT";
export const TrackerSyncedEvent = bg.EventDraft.merge(
  z.object({
    name: z.literal(TRACKER_SYNCED_EVENT),
    version: z.literal(1),
    payload: VO.Tracker.pick({ id: true, value: true, updatedAt: true }).merge(
      z.object({ datapointId: VO.TrackerSyncDatapointId })
    ),
  })
);
export type TrackerSyncedEventType = z.infer<typeof TrackerSyncedEvent>;

export const TRACKER_REVERT_EVENT = "TRACKER_REVERT_EVENT";
export const TrackerRevertEvent = bg.EventDraft.merge(
  z.object({
    name: z.literal(TRACKER_REVERT_EVENT),
    version: z.literal(1),
    payload: z.object({
      id: VO.TrackerId,
      datapointId: VO.TrackerSyncDatapointId,
    }),
  })
);
export type TrackerRevertEventType = z.infer<typeof TrackerRevertEvent>;

Emittery.isDebugEnabled = true;

export const emittery = new Emittery<{
  TRACKER_ADDED_EVENT: TrackerAddedEventType;
  TRACKER_SYNCED_EVENT: TrackerSyncedEventType;
  TRACKER_REVERT_EVENT: TrackerRevertEventType;
}>();

emittery.on(TRACKER_ADDED_EVENT, async (event) => {
  await Repos.TrackerRepository.create(event.payload);
});

emittery.on(TRACKER_SYNCED_EVENT, async (event) => {
  await Repos.TrackerRepository.sync(event.payload);
  await Repos.TrackerSyncDatapointRepository.add(event.payload);
});

emittery.on(TRACKER_REVERT_EVENT, async (event) => {
  await Repos.TrackerSyncDatapointRepository.remove({
    datapointId: event.payload.datapointId,
  });

  const latestDatapointForTracker =
    await Repos.TrackerSyncDatapointRepository.getLatestDatapointForTracker(
      event.payload.id
    );

  await Repos.TrackerRepository.sync({
    id: event.payload.id,
    value: VO.TrackerValue.parse(
      latestDatapointForTracker?.value ?? VO.DEFAULT_TRACKER_VALUE
    ),
    updatedAt: VO.TrackerUpdatedAt.parse(Date.now()),
  });
});
