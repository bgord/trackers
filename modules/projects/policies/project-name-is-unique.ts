import * as bg from "@bgord/node";

import * as VO from "../value-objects";
import * as Repos from "../repositories";

export class ProjectNameIsUniqueError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, ProjectNameIsUniqueError.prototype);
  }
}

type ProjectNameIsUniqueErrorConfigType = { name: VO.ProjectType["name"] };

class ProjectNameIsUniqueFactory extends bg.Policy<ProjectNameIsUniqueErrorConfigType> {
  async fails(config: ProjectNameIsUniqueErrorConfigType): Promise<boolean> {
    const numberOfProjectsWithName =
      await Repos.ProjectRepository.countProjectsWithName(config.name);

    return numberOfProjectsWithName > 0;
  }

  message = "project.name.unique.error";

  error = ProjectNameIsUniqueError;
}

export const ProjectNameIsUnique = new ProjectNameIsUniqueFactory();
