import * as VO from "../value-objects";

import { db } from "../db";

export class TrackerSyncDatapointRepository {
  static async add(
    payload: Pick<VO.TrackerType, "id" | "value" | "updatedAt">
  ) {
    return db.trackerSyncDatapoint.create({
      data: {
        trackerId: payload.id,
        value: payload.value,
        createdAt: payload.updatedAt,
      },
    });
  }

  static async list(payload: Pick<VO.TrackerType, "id">) {
    return db.trackerSyncDatapoint.findMany({
      where: { trackerId: payload.id },
      orderBy: { createdAt: "asc" },
    });
  }
}
