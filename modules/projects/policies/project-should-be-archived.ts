import * as bg from "@bgord/node";

import * as Aggregates from "../aggregates";
import * as VO from "../value-objects";

export class ProjectShouldBeArchivedError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, ProjectShouldBeArchivedError.prototype);
  }
}

type ProjectShouldBeArchivedConfigType = {
  project: Aggregates.Project;
};

class ProjectShouldBeArchivedFactory extends bg.Policy<ProjectShouldBeArchivedConfigType> {
  async fails(config: ProjectShouldBeArchivedConfigType): Promise<boolean> {
    return config.project.entity?.status !== VO.ProjectStatusEnum.archived;
  }

  message = "project.archived.error";

  error = ProjectShouldBeArchivedError;
}

export const ProjectShouldBeArchived = new ProjectShouldBeArchivedFactory();
