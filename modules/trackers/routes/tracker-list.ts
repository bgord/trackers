import express from "express";

import * as Repos from "../repositories";

export async function TrackerList(
  _request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  const trackers = await Repos.TrackerRepository.list();

  return response.status(200).send(trackers);
}
