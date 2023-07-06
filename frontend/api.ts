import * as bg from "@bgord/frontend";

import * as types from "./types";

export class Tracker {
  static async create(tracker: {
    name: types.TrackerType["name"];
    kind: types.TrackerKindEnum;
  }) {
    return bg.API("/tracker", {
      method: "POST",
      body: JSON.stringify(tracker),
    });
  }

  static async list(): Promise<types.TrackerType[]> {
    return bg
      .API("/tracker", { method: "GET" })
      .then((response) => (response.ok ? response.json() : []));
  }

  static async sync(
    payload: Pick<types.TrackerType, "id" | "value"> & {
      comment?: types.DatapointType["comment"];
    }
  ) {
    return bg.API(`/tracker/${payload.id}/sync`, {
      method: "POST",
      body: JSON.stringify({ value: payload.value, comment: payload.comment }),
    });
  }

  static async revert(payload: Pick<types.DatapointType, "id" | "trackerId">) {
    return bg.API(`/tracker/${payload.trackerId}/revert/${payload.id}`, {
      method: "DELETE",
    });
  }

  static async archive(payload: Pick<types.TrackerType, "id">) {
    return bg.API(`/tracker/${payload.id}/archive`, { method: "POST" });
  }

  static async restore(payload: Pick<types.TrackerType, "id">) {
    return bg.API(`/tracker/${payload.id}/restore`, { method: "POST" });
  }

  static async delete(payload: Pick<types.TrackerType, "id">) {
    return bg.API(`/tracker/${payload.id}`, {
      method: "DELETE",
    });
  }

  static async export(
    payload: Pick<types.TrackerType, "id"> & { email: types.EmailType }
  ) {
    return bg.API(`/tracker/${payload.id}/export`, {
      method: "POST",
      body: JSON.stringify({ email: payload.email }),
    });
  }

  static async changeName(payload: Pick<types.TrackerType, "id" | "name">) {
    return bg.API(`/tracker/${payload.id}/name`, {
      method: "POST",
      body: JSON.stringify({ name: payload.name }),
    });
  }

  static async getDatapoints(
    id: types.TrackerType["id"]
  ): Promise<types.DatapointType[]> {
    return bg
      .API(`/tracker/${id}/datapoints`, { method: "GET" })
      .then((response) => (response.ok ? response.json() : []));
  }

  static async deleteComment(payload: Pick<types.DatapointType, "id">) {
    return bg.API(`/datapoint/${payload.id}/comment`, { method: "DELETE" });
  }

  static async updateComment(
    payload: Pick<types.DatapointType, "id" | "comment">
  ) {
    return bg.API(`/datapoint/${payload.id}/comment`, {
      method: "POST",
      body: JSON.stringify({ comment: payload.comment }),
    });
  }
}

export class Settings {
  static async get(): Promise<types.SettingsType> {
    return bg
      .API("/settings/data", { method: "GET" })
      .then((response) => response.json());
  }

  static async weeklyTrackersReportEnable() {
    return bg.API("/settings/weekly-trackers-report/enable", {
      method: "POST",
    });
  }

  static async weeklyTrackersReportDisable() {
    return bg.API("/settings/weekly-trackers-report/disable", {
      method: "POST",
    });
  }

  static async emailChange(payload: { email: types.SettingsType["email"] }) {
    return bg.API("/settings/email/change", {
      method: "POST",
      body: JSON.stringify({ email: payload.email }),
    });
  }

  static async emailDelete() {
    return bg.API("/settings/email", { method: "DELETE" });
  }
}

export class Goal {
  static async create(
    goal: Pick<types.GoalType, "kind" | "target" | "relatedTrackerId">
  ) {
    return bg.API("/goal", {
      method: "POST",
      body: JSON.stringify(goal),
    });
  }

  static async getForTracker(
    payload: Pick<types.GoalType, "relatedTrackerId">
  ): Promise<types.GoalType> {
    return bg
      .API(`/tracker/${payload.relatedTrackerId}/goal`, {
        method: "GET",
      })
      .then((response) => (response.ok ? response.json() : undefined));
  }

  static async delete(payload: Pick<types.GoalType, "id">) {
    return bg.API(`/goal/${payload.id}`, {
      method: "DELETE",
    });
  }
}

export class History {
  static async list(
    relatedTrackerId: types.HistoryType["relatedTrackerId"],
    page: bg.PageType
  ): Promise<bg.Paged<types.HistoryViewType>> {
    return bg
      .API(`/history/${relatedTrackerId}/list?page=${page}`, { method: "GET" })
      .then((response) =>
        response.ok ? response.json() : bg.Pagination.empty
      );
  }
}
