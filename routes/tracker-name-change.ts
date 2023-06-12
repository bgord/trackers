import express from "express";

import * as VO from "../value-objects";
import * as Aggregates from "../aggregates";

export async function TrackerNameChange(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  const id = VO.TrackerId.parse(request.params.trackerId);
  const name = VO.TrackerName.parse(request.body.name);

  const tracker = await new Aggregates.Tracker(id).build();
  await tracker.changeName(name);

  return response.status(200).send();
}
