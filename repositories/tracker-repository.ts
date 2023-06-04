import _ from "lodash";
import { z } from "zod";

import { db } from "../db";
import * as VO from "../value-objects";

export class TrackerRepository {
  static async create(payload: VO.TrackerType) {
    return db.tracker.create({
      data: { ...payload, updatedAt: payload.createdAt },
    });
  }

  static async list(): Promise<VO.TrackerType[]> {
    const trackers = await db.tracker.findMany();

    return z.array(VO.Tracker).parse(trackers);
  }

  static async sync(
    payload: Pick<VO.TrackerType, "id" | "value" | "updatedAt">
  ) {
    const { id, ...data } = payload;

    return db.tracker.update({ where: { id }, data });
  }

  static async getNumberOfTrackersWithName(name: VO.TrackerNameType) {
    return db.tracker.count({ where: { name } });
  }
}
