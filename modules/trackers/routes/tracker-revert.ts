import express from "express";

import * as VO from "../value-objects";
import * as Aggregates from "../aggregates";

export async function TrackerRevert(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  const id = VO.TrackerId.parse(request.params.trackerId);

  const datapointId = VO.DatapointId.parse(request.params.datapointId);

  const tracker = await new Aggregates.Tracker(id).build();
  await tracker.revert(datapointId);

  return response.status(200).send();
}
