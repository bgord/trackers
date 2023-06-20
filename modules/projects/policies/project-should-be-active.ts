import * as bg from "@bgord/node";

import * as Aggregates from "../aggregates";
import * as VO from "../value-objects";

export class ProjectShouldBeActiveError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, ProjectShouldBeActiveError.prototype);
  }
}

type ProjectShouldBeActiveConfigType = {
  project: Aggregates.Project;
};

class ProjectShouldBeActiveFactory extends bg.Policy<ProjectShouldBeActiveConfigType> {
  async fails(config: ProjectShouldBeActiveConfigType): Promise<boolean> {
    return config.project.entity?.status !== VO.ProjectStatusEnum.active;
  }

  message = "project.active.error";

  error = ProjectShouldBeActiveError;
}

export const ProjectShouldBeActive = new ProjectShouldBeActiveFactory();
