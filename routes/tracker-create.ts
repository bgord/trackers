import express from "express";

import * as VO from "../value-objects";
import { logger } from "../logger";

export async function TrackerCreate(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  const name = VO.TrackerName.parse(request.body.name);

  logger.info({
    message: "Tracker create payload",
    operation: "tracker_create_payload",
    metadata: { name },
  });

  return response.send();
}
