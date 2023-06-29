import * as bg from "@bgord/node";

import * as VO from "../value-objects";
import * as infra from "../../../infra";

export class DatapointRepository {
  static async add(
    payload: Pick<VO.TrackerType, "id" | "value" | "updatedAt"> & {
      datapointId: VO.DatapointType["id"];
      comment?: VO.DatapointCommentType;
    }
  ) {
    return infra.db.trackerDatapoint.create({
      data: {
        id: payload.datapointId,
        trackerId: payload.id,
        value: payload.value,
        createdAt: payload.updatedAt,
        comment: payload.comment,
      },
    });
  }

  static async remove(payload: { datapointId: VO.DatapointType["id"] }) {
    return infra.db.trackerDatapoint.delete({
      where: { id: payload.datapointId },
    });
  }

  static async list(payload: Pick<VO.TrackerType, "id">) {
    const datapoints = await infra.db.trackerDatapoint.findMany({
      where: { trackerId: payload.id },
      orderBy: { createdAt: "desc" },
    });

    if (datapoints.length === 0) return [];

    const minMaxScaler = new bg.MinMaxScaler({
      bound: {
        lower: VO.DATAPOINT_BOUND_LOWER,
        upper: VO.DATAPOINT_BOUND_UPPER,
      },
      ...bg.MinMaxScaler.getMinMax(datapoints.map((point) => point.value)),
    });

    return datapoints.map((point) => ({
      ...point,
      value: minMaxScaler.scale(point.value),
    }));
  }

  static async listFromRange(
    payload: Pick<VO.TrackerType, "id"> & {
      from: bg.Schema.TimestampType;
      to: bg.Schema.TimestampType;
    }
  ) {
    return infra.db.trackerDatapoint.findMany({
      where: {
        trackerId: payload.id,
        createdAt: { gte: payload.from, lte: payload.to },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async countDatapointsForTracker(
    payload: Pick<VO.DatapointType, "trackerId">
  ) {
    return infra.db.trackerDatapoint.count({ where: payload });
  }

  static async getLatestDatapointForTracker(trackerId: VO.TrackerIdType) {
    return infra.db.trackerDatapoint.findFirst({
      where: { trackerId },
      orderBy: { createdAt: "desc" },
    });
  }

  static async countDatapointsFromToday(
    trackerId: VO.TrackerIdType,
    context: { timeZoneOffset: bg.TimeZoneOffsetsType }
  ): Promise<number> {
    const getStartOfDayTsInTz = bg.DateCalculator.getStartOfDayTsInTz({
      now: Date.now(),
      timeZoneOffsetMs: context.timeZoneOffset.miliseconds,
    });

    return infra.db.trackerDatapoint.count({
      where: { trackerId, createdAt: { gte: getStartOfDayTsInTz } },
    });
  }

  static async getDatapoint(id: VO.DatapointIdType) {
    return infra.db.trackerDatapoint.findFirst({ where: { id } });
  }
}
