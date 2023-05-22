import * as bg from "@bgord/node";

import * as Events from "../events";
import * as VO from "../value-objects";
import * as Repos from "../repositories";

export class Tracker {
  id: VO.TrackerType["id"];

  stream: bg.EventType["stream"];

  entity: VO.TrackerType | null = null;

  constructor(id: VO.TrackerType["id"]) {
    this.id = id;
    this.stream = Tracker.getStream(id);
  }

  async build() {
    const events = await Repos.EventRepository.find(
      [Events.TrackerAddedEvent],
      Tracker.getStream(this.id)
    );

    for (const event of events) {
      switch (event.name) {
        case Events.TRACKER_ADDED_EVENT:
          this.entity = event.payload;
          break;

        default:
          continue;
      }
    }

    return this;
  }

  static async add(payload: Omit<VO.TrackerType, "id">) {
    const newTrackerId = VO.TrackerId.parse(bg.NewUUID.generate());

    await Repos.EventRepository.save(
      Events.TrackerAddedEvent.parse({
        name: Events.TRACKER_ADDED_EVENT,
        stream: Tracker.getStream(newTrackerId),
        version: 1,
        payload: { id: newTrackerId, ...payload },
      })
    );
  }

  static getStream(id: VO.TrackerIdType) {
    return `tracker_${id}`;
  }
}
