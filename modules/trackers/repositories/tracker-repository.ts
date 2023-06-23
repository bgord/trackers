import * as bg from "@bgord/node";
import _ from "lodash";
import { z } from "zod";

import * as infra from "../../../infra";
import * as VO from "../value-objects";

export class TrackerRepository {
  static async create(payload: VO.TrackerType) {
    return infra.db.tracker.create({
      data: { ...payload, updatedAt: payload.createdAt },
    });
  }

  static async list(): Promise<VO.TrackerViewType[]> {
    const trackers = await infra.db.tracker.findMany({
      orderBy: [{ createdAt: "desc" }],
    });

    return z
      .array(VO.Tracker)
      .parse(trackers)
      .map((tracker) => ({
        ...tracker,
        createdAt: bg.RelativeDate.to.now.truthy(tracker.createdAt),
        updatedAt: bg.RelativeDate.to.now.truthy(tracker.updatedAt),
      }));
  }

  static async listActive(): Promise<VO.TrackerViewType[]> {
    const trackers = await infra.db.tracker.findMany({
      where: { status: VO.TrackerStatusEnum.active },
      orderBy: [{ createdAt: "desc" }],
    });

    return z
      .array(VO.Tracker)
      .parse(trackers)
      .map((tracker) => ({
        ...tracker,
        createdAt: bg.RelativeDate.to.now.truthy(tracker.createdAt),
        updatedAt: bg.RelativeDate.to.now.truthy(tracker.updatedAt),
      }));
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

  static async archive(payload: Pick<VO.TrackerType, "id" | "updatedAt">) {
    return infra.db.tracker.update({
      where: { id: payload.id },
      data: {
        status: VO.TrackerStatusEnum.archived,
        updatedAt: payload.updatedAt,
      },
    });
  }

  static async restore(payload: Pick<VO.TrackerType, "id" | "updatedAt">) {
    return infra.db.tracker.update({
      where: { id: payload.id },
      data: {
        status: VO.TrackerStatusEnum.active,
        updatedAt: payload.updatedAt,
      },
    });
  }

  static async changeName(
    payload: Pick<VO.TrackerType, "id" | "name" | "updatedAt">
  ) {
    return infra.db.tracker.update({
      where: { id: payload.id },
      data: { name: payload.name, updatedAt: payload.updatedAt },
    });
  }

  static async countTrackersWithName(name: VO.TrackerNameType) {
    return infra.db.tracker.count({ where: { name } });
  }

  static async count() {
    return infra.db.tracker.count();
  }
}
