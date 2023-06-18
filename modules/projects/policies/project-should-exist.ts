import * as bg from "@bgord/node";
import * as Aggregates from "../aggregates";

export class ProjectShouldExistError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, ProjectShouldExistError.prototype);
  }
}

type ProjectShouldExistConfigType = {
  project: Aggregates.Project;
};

class ProjectShouldExistFactory extends bg.Policy<ProjectShouldExistConfigType> {
  async fails(config: ProjectShouldExistConfigType): Promise<boolean> {
    return config.project.entity === null;
  }

  message = "tracker.exists.error";

  error = ProjectShouldExistError;
}

export const ProjectShouldExist = new ProjectShouldExistFactory();
