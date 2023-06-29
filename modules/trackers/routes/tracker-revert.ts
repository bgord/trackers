import express from "express";

import * as VO from "../value-objects";
import * as Aggregates from "../aggregates";
import * as infra from "../../../infra";

export async function TrackerRevert(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  const id = VO.TrackerId.parse(request.params.trackerId);

  const datapointId = VO.DatapointId.parse(request.params.datapointId);

  infra.logger.info({
    message: "Tracker revert payload",
    operation: "tracker_revert_payload",
    correlationId: request.requestId,
    metadata: { id, datapointId },
  });

  const tracker = await new Aggregates.Tracker(id).build();
  await tracker.revert(datapointId);

  return response.status(200).send();
}
