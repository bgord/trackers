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
      orderBy: { createdAt: "asc" },
    });

    if (datapoints.length === 0) return [];

    const minMaxScaler = new bg.MinMaxScaler({
      bound: { lower: 0, upper: 100 },
      ...bg.MinMaxScaler.getMinMax(datapoints.map((point) => point.value)),
    });

    return datapoints.map((point) => ({
      ...point,
      value: {
        actual: point.value,
        scaled: minMaxScaler.scale(point.value),
      },
    }));
  }
}
