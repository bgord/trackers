import * as bg from "@bgord/node";

import * as Events from "../events";
import * as VO from "../value-objects";
import * as Repos from "../repositories";
import * as Policies from "../policies";

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

  static getStream(id: VO.TrackerIdType) {
    return `tracker_${id}`;
  }
}
