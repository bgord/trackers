import express from "express";

import * as VO from "../value-objects";
import * as Aggregates from "../aggregates";

export async function TrackerRestore(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  const id = VO.TrackerId.parse(request.params.trackerId);

  const tracker = await new Aggregates.Tracker(id).build();
  await tracker.restore();

  return response.status(200).send();
}
