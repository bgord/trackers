import * as bg from "@bgord/frontend";

import * as types from "./types";

export const _api: typeof fetch = (input, init) =>
  fetch(input, {
    mode: "same-origin",
    headers: {
      "Content-Type": "application/json",

      "time-zone-offset": new Date().getTimezoneOffset().toString(),
    },
    redirect: "follow",
    ...init,
  })
    .then(bg.ServerError.extract)
    .catch(bg.ServerError.handle);

export class Tracker {
  static async create(tracker: {
    name: types.TrackerType["name"];
    kind: types.TrackerKindEnum;
  }) {
    return _api("/tracker", {
      method: "POST",
      body: JSON.stringify(tracker),
    });
  }

  static async list(): Promise<types.TrackerType[]> {
    return _api("/tracker", { method: "GET" }).then((response) =>
      response.ok ? response.json() : []
    );
  }

  static async sync(payload: Pick<types.TrackerType, "id" | "value">) {
    return _api(`/tracker/${payload.id}/sync`, {
      method: "POST",
      body: JSON.stringify({ value: payload.value }),
    });
  }

  static async revert(
    payload: Pick<types.TrackerDatapointType, "id" | "trackerId">
  ) {
    return _api(`/tracker/${payload.trackerId}/revert/${payload.id}`, {
      method: "DELETE",
    });
  }

  static async archive(payload: Pick<types.TrackerType, "id">) {
    return _api(`/tracker/${payload.id}/archive`, { method: "POST" });
  }

  static async restore(payload: Pick<types.TrackerType, "id">) {
    return _api(`/tracker/${payload.id}/restore`, { method: "POST" });
  }

  static async delete(payload: Pick<types.TrackerType, "id">) {
    return _api(`/tracker/${payload.id}`, {
      method: "DELETE",
    });
  }

  static async export(
    payload: Pick<types.TrackerType, "id"> & { email: types.EmailType }
  ) {
    return _api(`/tracker/${payload.id}/export`, {
      method: "POST",
      body: JSON.stringify({ email: payload.email }),
    });
  }

  static async changeName(payload: Pick<types.TrackerType, "id" | "name">) {
    return _api(`/tracker/${payload.id}/name`, {
      method: "POST",
      body: JSON.stringify({ name: payload.name }),
    });
  }

  static async getDatapoints(
    id: types.TrackerType["id"]
  ): Promise<types.TrackerDatapointType[]> {
    return _api(`/tracker/${id}/datapoints`, { method: "GET" }).then(
      (response) => (response.ok ? response.json() : [])
    );
  }
}

export class Settings {
  static async get(): Promise<types.SettingsType> {
    return _api("/settings/data", { method: "GET" }).then((response) =>
      response.json()
    );
  }

  static async weeklyTrackersReportEnable() {
    return _api("/settings/weekly-trackers-report/enable", {
      method: "POST",
    });
  }

  static async weeklyTrackersReportDisable() {
    return _api("/settings/weekly-trackers-report/disable", {
      method: "POST",
    });
  }

  static async emailChange(payload: { email: types.SettingsType["email"] }) {
    return _api("/settings/email/change", {
      method: "POST",
      body: JSON.stringify({ email: payload.email }),
    });
  }

  static async emailDelete() {
    return _api("/settings/email", { method: "DELETE" });
  }
}

export class Goal {
  static async create(
    goal: Pick<types.GoalType, "kind" | "target" | "relatedTrackerId">
  ) {
    return _api("/goal", {
      method: "POST",
      body: JSON.stringify(goal),
    });
  }

  static async getForTracker(
    payload: Pick<types.GoalType, "relatedTrackerId">
  ): Promise<types.GoalType | null> {
    return _api(`/tracker/${payload.relatedTrackerId}/goal`, {
      method: "GET",
    }).then((response) => (response.ok ? response.json() : null));
  }
}
