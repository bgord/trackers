import * as bg from "@bgord/node";
import _ from "lodash";

import * as Events from "../events";
import * as VO from "../value-objects";
import * as Repos from "../repositories";
import * as Policies from "../policies";

export class Tracker {
  id: VO.TrackerType["id"];

  stream: bg.EventType["stream"];

  entity: VO.TrackerType | null = null;

  DEFAULT_TRACKER_VALUE = VO.DEFAULT_TRACKER_VALUE;

  DATAPOINTS_LIMIT_PER_DAY = VO.TRACKER_DATAPOINTS_LIMIT_PER_DAY;

  constructor(id: VO.TrackerType["id"]) {
    this.id = id;
    this.stream = Tracker.getStream(id);
  }

  async build() {
    const events = await Repos.EventRepository.find(
      [
        Events.TrackerAddedEvent,
        Events.TrackerSyncedEvent,
        Events.TrackerRevertedEvent,
        Events.TrackerDeletedEvent,
        Events.TrackerExportedEvent,
      ],
      Tracker.getStream(this.id)
    );

    const values = [];

    for (const event of events) {
      switch (event.name) {
        case Events.TRACKER_ADDED_EVENT:
          this.entity = event.payload;
          break;

        case Events.TRACKER_SYNCED_EVENT:
          if (!this.entity) continue;

          values.push(event.payload);

          this.entity.value = VO.TrackerValue.parse(
            _.last(values)?.value ?? this.DEFAULT_TRACKER_VALUE
          );

          this.entity.updatedAt = event.payload.updatedAt;
          break;

        case Events.TRACKER_REVERTED_EVENT:
          if (!this.entity) continue;

          _.remove(values, (v) => v.datapointId === event.payload.datapointId);

          this.entity.value = VO.TrackerValue.parse(
            _.last(values)?.value ?? this.DEFAULT_TRACKER_VALUE
          );

          this.entity.updatedAt = event.payload.updatedAt;
          break;

        case Events.TRACKER_DELETED_EVENT:
          if (!this.entity) continue;

          this.entity = null;
          break;

        default:
          continue;
      }
    }

    return this;
  }

  static async add(payload: Pick<VO.TrackerType, "kind" | "name">) {
    const id = VO.TrackerId.parse(bg.NewUUID.generate());

    await Policies.TrackerNameIsUnique.perform({ trackerName: payload.name });

    await Repos.EventRepository.save(
      Events.TrackerAddedEvent.parse({
        name: Events.TRACKER_ADDED_EVENT,
        stream: Tracker.getStream(id),
        version: 1,
        payload: { id, ...payload },
      })
    );
  }

  async sync(
    value: VO.TrackerValueType,
    context: { timeZoneOffset: bg.TimeZoneOffsetsType }
  ) {
    await Policies.TrackerShouldExist.perform({ tracker: this });

    await Policies.TrackerValueShouldChange.perform({
      currentValue: this.entity!.value,
      syncedValue: value,
    });

    await Policies.TrackerSyncDatapointsLimitPerDay.perform({
      trackerId: this.id,
      limit: this.DATAPOINTS_LIMIT_PER_DAY,
      ...context,
    });

    await Repos.EventRepository.save(
      Events.TrackerSyncedEvent.parse({
        name: Events.TRACKER_SYNCED_EVENT,
        stream: this.stream,
        version: 1,
        payload: {
          id: this.id,
          value,
          updatedAt: Date.now(),
          datapointId: VO.TrackerDatapointId.parse(bg.NewUUID.generate()),
        },
      })
    );
  }

  async revert(datapointId: VO.TrackerDatapointIdType) {
    await Policies.TrackerShouldExist.perform({ tracker: this });

    await Repos.EventRepository.save(
      Events.TrackerRevertedEvent.parse({
        name: Events.TRACKER_REVERTED_EVENT,
        stream: this.stream,
        version: 1,
        payload: { id: this.id, datapointId, updatedAt: Date.now() },
      })
    );
  }

  async delete() {
    await Policies.TrackerShouldExist.perform({ tracker: this });

    await Repos.EventRepository.save(
      Events.TrackerDeletedEvent.parse({
        name: Events.TRACKER_DELETED_EVENT,
        stream: this.stream,
        version: 1,
        payload: { id: this.id },
      })
    );
  }

  async export(email: bg.Schema.EmailType) {
    await Policies.TrackerShouldExist.perform({ tracker: this });

    await Repos.EventRepository.save(
      Events.TrackerExportedEvent.parse({
        name: Events.TRACKER_EXPORTED_EVENT,
        stream: this.stream,
        version: 1,
        payload: { id: this.id, scheduledAt: Date.now(), email },
      })
    );
  }

  static getStream(id: VO.TrackerIdType) {
    return `tracker_${id}`;
  }
}
