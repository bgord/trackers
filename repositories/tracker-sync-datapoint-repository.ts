import * as bg from "@bgord/node";
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
    const datapoints = await db.trackerSyncDatapoint.findMany({
      where: { trackerId: payload.id },
      orderBy: { createdAt: "desc" },
    });

    if (datapoints.length === 0) return [];

    const minMaxScaler = new bg.MinMaxScaler({
      bound: {
        lower: VO.TRACKER_SYNC_DATAPOINT_BOUND_LOWER,
        upper: VO.TRACKER_SYNC_DATAPOINT_BOUND_UPPER,
      },
      ...bg.MinMaxScaler.getMinMax(datapoints.map((point) => point.value)),
    });

    return datapoints.map((point) => ({
      ...point,
      value: minMaxScaler.scale(point.value),
    }));
  }
}
