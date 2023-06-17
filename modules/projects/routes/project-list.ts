import express from "express";

import * as Repos from "../repositories";

export async function ProjectList(
  _request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  const projects = await Repos.ProjectRepository.list();

  return response.status(200).send(projects);
}
