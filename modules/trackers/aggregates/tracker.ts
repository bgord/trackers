/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as bg from "@bgord/node";
import _ from "lodash";

import * as VO from "../value-objects";
import * as Policies from "../policies";
import * as Events from "../events";
import * as infra from "../../../infra";

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
    const events = await infra.EventStore.find(
      [
        Events.TrackerAddedEvent,
        Events.TrackerSyncedEvent,
        Events.TrackerRevertedEvent,
        Events.TrackerDeletedEvent,
        Events.TrackerExportedEvent,
        Events.TrackerNameChangedEvent,
        Events.TrackerArchivedEvent,
        Events.TrackerRestoredEvent,
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

        case Events.TRACKER_NAME_CHANGED_EVENT:
          if (!this.entity) continue;

          this.entity.name = event.payload.name;
          this.entity.updatedAt = event.payload.updatedAt;
          break;

        case Events.TRACKER_ARCHIVED_EVENT:
          if (!this.entity) continue;

          this.entity.status = VO.TrackerStatusEnum.archived;
          this.entity.updatedAt = event.payload.archivedAt;
          break;

        case Events.TRACKER_RESTORED_EVENT:
          if (!this.entity) continue;

          this.entity.status = VO.TrackerStatusEnum.active;
          this.entity.updatedAt = event.payload.restoredAt;
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

    await infra.EventStore.save(
      Events.TrackerAddedEvent.parse({
        name: Events.TRACKER_ADDED_EVENT,
        stream: Tracker.getStream(id),
        version: 1,
        payload: { id, ...payload },
      })
    );
  }

  async sync(
    datapoint: {
      value: VO.TrackerValueType;
      comment: VO.TrackerDatapointCommentType;
    },
    context: { timeZoneOffset: bg.TimeZoneOffsetsType }
  ) {
    await Policies.TrackerShouldExist.perform({ tracker: this });
    await Policies.TrackerIsActive.perform({ tracker: this });
    await Policies.TrackerValueShouldChange.perform({
      currentValue: this.entity!.value,
      syncedValue: datapoint.value,
    });
    await Policies.TrackerDatapointsLimitPerDay.perform({
      trackerId: this.id,
      limit: this.DATAPOINTS_LIMIT_PER_DAY,
      ...context,
    });

    await infra.EventStore.save(
      Events.TrackerSyncedEvent.parse({
        name: Events.TRACKER_SYNCED_EVENT,
        stream: this.stream,
        version: 1,
        payload: {
          id: this.id,
          value: datapoint.value,
          comment: datapoint.comment,
          updatedAt: Date.now(),
          datapointId: VO.TrackerDatapointId.parse(bg.NewUUID.generate()),
        },
      })
    );
  }

  async revert(datapointId: VO.TrackerDatapointIdType) {
    await Policies.TrackerShouldExist.perform({ tracker: this });
    await Policies.TrackerIsActive.perform({ tracker: this });
    await Policies.TrackerDatapointShouldExist.perform({ datapointId });

    await infra.EventStore.save(
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

    await infra.EventStore.save(
      Events.TrackerDeletedEvent.parse({
        name: Events.TRACKER_DELETED_EVENT,
        stream: this.stream,
        version: 1,
        payload: { id: this.id },
      })
    );
  }

  async export(
    email: bg.Schema.EmailType,
    context: { timeZoneOffset: bg.TimeZoneOffsetsType }
  ) {
    await Policies.TrackerShouldExist.perform({ tracker: this });
    await Policies.TrackerShouldHaveDatapoints.perform({ trackerId: this.id });

    await infra.EventStore.save(
      Events.TrackerExportedEvent.parse({
        name: Events.TRACKER_EXPORTED_EVENT,
        stream: this.stream,
        version: 1,
        payload: {
          id: this.id,
          scheduledAt: Date.now(),
          email,
          name: this.entity!.name,
          timeZoneOffsetMs: context.timeZoneOffset.miliseconds,
        },
      })
    );
  }

  async archive() {
    await Policies.TrackerShouldExist.perform({ tracker: this });
    await Policies.TrackerIsActive.perform({ tracker: this });

    await infra.EventStore.save(
      Events.TrackerArchivedEvent.parse({
        name: Events.TRACKER_ARCHIVED_EVENT,
        stream: this.stream,
        version: 1,
        payload: { id: this.id, archivedAt: Date.now() },
      })
    );
  }

  async restore() {
    await Policies.TrackerShouldExist.perform({ tracker: this });
    await Policies.TrackerIsArchived.perform({ tracker: this });

    await infra.EventStore.save(
      Events.TrackerRestoredEvent.parse({
        name: Events.TRACKER_RESTORED_EVENT,
        stream: this.stream,
        version: 1,
        payload: { id: this.id, restoredAt: Date.now() },
      })
    );
  }

  async changeName(name: VO.TrackerNameType) {
    await Policies.TrackerShouldExist.perform({ tracker: this });
    await Policies.TrackerIsActive.perform({ tracker: this });
    await Policies.TrackerNameHasChanged.perform({
      current: this.entity!.name,
      next: name,
    });
    await Policies.TrackerNameIsUnique.perform({ trackerName: name });

    await infra.EventStore.save(
      Events.TrackerNameChangedEvent.parse({
        name: Events.TRACKER_NAME_CHANGED_EVENT,
        stream: this.stream,
        version: 1,
        payload: { id: this.id, name, updatedAt: Date.now() },
      })
    );
  }

  static getStream(id: VO.TrackerIdType) {
    return `tracker_${id}`;
  }
}
