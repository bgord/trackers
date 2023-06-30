import express from "express";

import * as VO from "../value-objects";
import * as Services from "../services";

export async function DatapointCommentDelete(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  const id = VO.DatapointId.parse(request.params.datapointId);

  const comment = await new Services.DatapointComment(id).build();
  await comment.delete();

  return response.status(200);
}
