import express from "express";

import * as VO from "../value-objects";
import * as Services from "../services";

export async function GoalCreate(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  const target = VO.GoalTarget.parse(request.body.target);
  const kind = VO.GoalKind.parse(request.body.kind);
  const relatedTrackerId = VO.GoalRelatedTrackerId.parse(
    request.body.relatedTrackerId
  );

  await Services.GoalFactory.create({ target, kind, relatedTrackerId });

  return response.status(201).send();
}
