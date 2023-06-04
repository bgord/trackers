import * as types from "./types";
import { ServerError } from "./server-error";

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
    .then(ServerError.extract)
    .catch(ServerError.handle);

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

  static async getSyncDatapoints(
    id: types.TrackerType["id"]
  ): Promise<types.TrackerSyncDatapointType[]> {
    return _api(`/tracker/${id}/sync/datapoints`, { method: "GET" }).then(
      (response) => (response.ok ? response.json() : [])
    );
  }
}
