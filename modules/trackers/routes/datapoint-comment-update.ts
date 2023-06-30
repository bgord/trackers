import express from "express";

import * as VO from "../value-objects";
import * as Services from "../services";

export async function DatapointCommentUpdate(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  const id = VO.DatapointId.parse(request.params.datapointId);
  const updatedComment = VO.DatapointComment.parse(request.body.comment);

  const comment = await new Services.DatapointComment(id).build();
  await comment.update(updatedComment);

  return response.status(200).send();
}
