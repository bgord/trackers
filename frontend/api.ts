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
  static async create(tracker: { name: types.TrackerNameType }) {
    return _api("/tracker", {
      method: "POST",
      body: JSON.stringify(tracker),
    });
  }
}
