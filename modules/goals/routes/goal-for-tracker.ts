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

  if (!result) {
    // TODO: refactor when the Goal should exist Policy is implemented
    return response.status(404).send("Not found");
  }

  return response.status(200).send(result);
}
