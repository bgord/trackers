import express from "express";
import * as Aggregates from "../aggregates";

export async function SettingsWeeklyTrackersReportDisable(
  _request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  const settings = await new Aggregates.Settings().build();

  await settings.disableWeeklyTrackersReport();

  return response.status(200).send();
}
