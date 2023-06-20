import express from "express";

import * as VO from "../value-objects";
import * as Aggregates from "../aggregates";
import * as infra from "../../../infra";

export async function TaskCreate(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  const id = VO.ProjectId.parse(request.params.projectId);
  const name = VO.TaskName.parse(request.body.name);

  infra.logger.info({
    message: "Task create payload",
    operation: "task_create_payload",
    correlationId: request.requestId,
    metadata: { name },
  });

  const project = await new Aggregates.Project(id).build();

  const task = { name };
  await project.addTask(task);

  return response.status(201).send();
}
