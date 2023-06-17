import express from "express";

import * as Aggregates from "../aggregates";

export async function SettingsEmailDelete(
  _request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  const settings = await new Aggregates.Settings().build();
  await settings.deleteEmail();

  return response.status(200).send();
}
