import * as bg from "@bgord/node";
import express from "express";

import * as VO from "../value-objects";
import * as Repos from "../repositories";
import * as infra from "../infra";

export async function TrackerSyncDatapoints(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  const id = VO.TrackerId.parse(request.params.trackerId);

  const trackerSyncDatapoints = await Repos.TrackerSyncDatapointRepository.list(
    { id }
  );

  infra.ResponseCache.set(
    request.url,
    trackerSyncDatapoints,
    bg.Time.Minutes(5).toSeconds()
  );
  return response.status(200).send(trackerSyncDatapoints);
}
