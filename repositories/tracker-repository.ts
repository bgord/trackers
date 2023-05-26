import _ from "lodash";

import { db } from "../db";
import * as VO from "../value-objects";

export class TrackerRepository {
  static async create(payload: VO.TrackerType) {
    return db.tracker.create({ data: payload });
  }

  static async list() {
    return db.tracker.findMany();
  }

  static async getNumberOfTrackersWithName(name: VO.TrackerNameType) {
    return db.tracker.count({ where: { name } });
  }
}
