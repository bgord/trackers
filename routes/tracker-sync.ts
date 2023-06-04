import express from "express";

import * as VO from "../value-objects";
import * as Aggregates from "../aggregates";
import { logger } from "../logger";

export async function TrackerSync(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  const id = VO.TrackerId.parse(request.params.trackerId);
  const value = VO.TrackerValue.parse(request.body.value);

  logger.info({
    message: "Tracker sync payload",
    operation: "tracker_sync_payload",
    correlationId: request.requestId,
    metadata: { id, value },
  });

  const tracker = await new Aggregates.Tracker(id).build();
  await tracker.sync(value);

  return response.status(200).send();
}
