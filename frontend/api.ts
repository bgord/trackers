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
    name: types.TrackerNameType;
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
}
