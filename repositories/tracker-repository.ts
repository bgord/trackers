import _ from "lodash";
import { z } from "zod";

import * as infra from "../infra";
import * as VO from "../value-objects";

export class TrackerRepository {
  static async create(payload: VO.TrackerType) {
    return infra.db.tracker.create({
      data: { ...payload, updatedAt: payload.createdAt },
    });
  }

  static async list(): Promise<VO.TrackerType[]> {
    const trackers = await infra.db.tracker.findMany();

    return z.array(VO.Tracker).parse(trackers);
  }

  static async sync(
    payload: Pick<VO.TrackerType, "id" | "value" | "updatedAt">
  ) {
    return infra.db.tracker.update({
      where: { id: payload.id },
      data: _.pick(payload, ["value", "updatedAt"]),
    });
  }

  static async delete(payload: Pick<VO.TrackerType, "id">) {
    return infra.db.tracker.delete({
      where: { id: payload.id },
    });
  }

  static async changeName(payload: Pick<VO.TrackerType, "id" | "name">) {
    return infra.db.tracker.update({
      where: { id: payload.id },
      data: { name: payload.name },
    });
  }

  static async countTrackersWithName(name: VO.TrackerNameType) {
    return infra.db.tracker.count({ where: { name } });
  }

  static async count() {
    return infra.db.tracker.count();
  }
}
