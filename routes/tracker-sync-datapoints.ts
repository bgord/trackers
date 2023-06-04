import express from "express";

import * as VO from "../value-objects";
import * as Repos from "../repositories";

export async function TrackerSyncDatapoints(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  const id = VO.TrackerId.parse(request.params.trackerId);

  const trackerSyncDatapoints = await Repos.TrackerSyncDatapointRepository.list(
    { id }
  );

  return response.status(200).send(trackerSyncDatapoints);
}
