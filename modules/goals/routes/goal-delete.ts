import express from "express";

import * as VO from "../value-objects";
import * as Aggregates from "../aggregates";

export async function GoalDelete(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  const id = VO.GoalId.parse(request.params.goalId);

  const goal = await new Aggregates.Goal(id).build();
  await goal.delete();

  return response.status(200).send();
}
