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
    payload: Pick<VO.TrackerType, "id" | "value" | "updatedAt"> & {
      datapointId: VO.TrackerSyncDatapointType["id"];
    }
  ) {
    const { id, datapointId, ...data } = payload;

    return infra.db.tracker.update({ where: { id }, data });
  }

  static async getNumberOfTrackersWithName(name: VO.TrackerNameType) {
    return infra.db.tracker.count({ where: { name } });
  }
}
