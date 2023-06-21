import express from "express";

import * as VO from "../value-objects";
import * as Repos from "../repositories";

export async function TaskList(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  const projectId = VO.ProjectId.parse(request.params.projectId);

  const tasks = await Repos.TaskRepository.list({ projectId });

  return response.status(200).send(tasks);
}
