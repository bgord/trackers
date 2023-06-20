import express from "express";

import * as VO from "../value-objects";
import * as Aggregates from "../aggregates";

export async function ProjectArchive(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  const id = VO.ProjectId.parse(request.params.projectId);

  const project = await new Aggregates.Project(id).build();
  await project.archive();

  return response.status(200).send();
}
