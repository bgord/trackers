import * as bg from "@bgord/node";
import * as VO from "../value-objects";
import * as infra from "../infra";

export class TrackerSyncDatapointRepository {
  static async add(
    payload: Pick<VO.TrackerType, "id" | "value" | "updatedAt"> & {
      datapointId: VO.TrackerSyncDatapointType["id"];
    }
  ) {
    return infra.db.trackerSyncDatapoint.create({
      data: {
        id: payload.datapointId,
        trackerId: payload.id,
        value: payload.value,
        createdAt: payload.updatedAt,
      },
    });
  }

  static async remove(payload: {
    datapointId: VO.TrackerSyncDatapointType["id"];
  }) {
    return infra.db.trackerSyncDatapoint.delete({
      where: { id: payload.datapointId },
    });
  }

  static async list(payload: Pick<VO.TrackerType, "id">) {
    const datapoints = await infra.db.trackerSyncDatapoint.findMany({
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

  static async getLatestDatapointForTracker(trackerId: VO.TrackerIdType) {
    return infra.db.trackerSyncDatapoint.findFirst({
      where: { trackerId },
      orderBy: { createdAt: "desc" },
    });
  }

  static async getDatapointsForToday(
    _trackerId: VO.TrackerIdType
  ): Promise<number> {
    return 4;
  }
}
