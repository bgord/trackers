import express from "express";

import * as VO from "../value-objects";
import * as Aggregates from "../aggregates";

import { SettingsEmail } from "../../settings/value-objects/settings-email";

export async function TrackerExport(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  const context = { timeZoneOffset: request.timeZoneOffset };

  const id = VO.TrackerId.parse(request.params.trackerId);
  const email = SettingsEmail.parse(request.body.email);

  const tracker = await new Aggregates.Tracker(id).build();
  await tracker.export(email, context);

  return response.status(200).send();
}
