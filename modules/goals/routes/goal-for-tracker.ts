import express from "express";

import * as VO from "../value-objects";
import * as Repos from "../repositories";

export async function GoalForTracker(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  const relatedTrackerId = VO.GoalRelatedTrackerId.parse(
    request.params.trackerId
  );

  const result = await Repos.GoalRepository.getForTracker({ relatedTrackerId });

  return response.status(200).send({ result });
}
