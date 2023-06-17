import express from "express";

import * as VO from "../value-objects";
import * as Aggregates from "../aggregates";
import * as infra from "../../../infra";

export async function ProjectCreate(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  const name = VO.ProjectName.parse(request.body.name);

  infra.logger.info({
    message: "Project create payload",
    operation: "project_create_payload",
    correlationId: request.requestId,
    metadata: { name },
  });

  await Aggregates.Project.create({ name });

  return response.status(201).send();
}
