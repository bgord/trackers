import express from "express";

import * as Repos from "../repositories";

export async function SettingsData(
  _request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  const settings = await Repos.SettingsRepository.get();

  return response.status(200).send(settings);
}
