import * as bg from "@bgord/node";
import z from "zod";
import Emittery from "emittery";

import * as VO from "./value-objects";
import * as Repos from "./repositories";
import * as Services from "./services";

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

export const TRACKER_REVERTED_EVENT = "TRACKER_REVERTED_EVENT";
export const TrackerRevertedEvent = bg.EventDraft.merge(
  z.object({
    name: z.literal(TRACKER_REVERTED_EVENT),
    version: z.literal(1),
    payload: z.object({
      id: VO.TrackerId,
      datapointId: VO.TrackerSyncDatapointId,
      updatedAt: VO.TrackerUpdatedAt,
    }),
  })
);
export type TrackerRevertedEventType = z.infer<typeof TrackerRevertedEvent>;

export const TRACKER_DELETED_EVENT = "TRACKER_DELETED_EVENT";
export const TrackerDeletedEvent = bg.EventDraft.merge(
  z.object({
    name: z.literal(TRACKER_DELETED_EVENT),
    version: z.literal(1),
    payload: z.object({ id: VO.TrackerId }),
  })
);
export type TrackerDeletedEventType = z.infer<typeof TrackerDeletedEvent>;

export const TRACKER_EXPORTED_EVENT = "TRACKER_EXPORTED_EVENT";
export const TrackerExportedEvent = bg.EventDraft.merge(
  z.object({
    name: z.literal(TRACKER_EXPORTED_EVENT),
    version: z.literal(1),
    payload: z.object({
      id: VO.TrackerId,
      scheduledAt: bg.Schema.Timestamp,
      email: bg.Schema.Email,
    }),
  })
);
export type TrackerExportedEventType = z.infer<typeof TrackerExportedEvent>;

Emittery.isDebugEnabled = true;

export const emittery = new Emittery<{
  TRACKER_ADDED_EVENT: TrackerAddedEventType;
  TRACKER_SYNCED_EVENT: TrackerSyncedEventType;
  TRACKER_REVERTED_EVENT: TrackerRevertedEventType;
  TRACKER_DELETED_EVENT: TrackerDeletedEventType;
  TRACKER_EXPORTED_EVENT: TrackerExportedEventType;
}>();

emittery.on(TRACKER_ADDED_EVENT, async (event) => {
  await Repos.TrackerRepository.create(event.payload);
});

emittery.on(TRACKER_SYNCED_EVENT, async (event) => {
  await Repos.TrackerRepository.sync(event.payload);
  await Repos.TrackerSyncDatapointRepository.add(event.payload);
});

emittery.on(TRACKER_REVERTED_EVENT, async (event) => {
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
    updatedAt: event.payload.updatedAt,
  });
});

emittery.on(TRACKER_DELETED_EVENT, async (event) => {
  await Repos.TrackerRepository.delete({ id: event.payload.id });
});

emittery.on(TRACKER_EXPORTED_EVENT, async (event) => {
  const TrackerDatapointsFile = new Services.TrackerDatapointsFile({
    repository: Repos.TrackerSyncDatapointRepository,
    ...event.payload,
  });

  const filename = await TrackerDatapointsFile.generate();

  await Services.TrackerExportSender.send({ filename, ...event.payload });
});
