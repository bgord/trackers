import _ from "lodash";

import { db } from "../db";
import * as VO from "../value-objects";

export class TrackerRepository {
  static async create(payload: VO.TrackerType) {
    return db.tracker.create({ data: payload });
  }
}
