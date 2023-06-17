import express from "express";

import * as VO from "../value-objects";
import * as Aggregates from "../aggregates";
import * as infra from "../../../infra";

export async function TrackerCreate(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  const name = VO.TrackerName.parse(request.body.name);
  const kind = VO.TrackerKind.parse(request.body.kind);

  infra.logger.info({
    message: "Tracker create payload",
    operation: "tracker_create_payload",
    correlationId: request.requestId,
    metadata: { name, kind },
  });

  await Aggregates.Tracker.add({ name, kind });

  return response.status(201).send();
}
