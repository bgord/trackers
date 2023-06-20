import * as bg from "@bgord/node";

import * as VO from "../value-objects";
import * as Repos from "../repositories";

export class ProjectTaskNameIsUniqueError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, ProjectTaskNameIsUniqueError.prototype);
  }
}

type ProjectTaskNameIsUniqueErrorConfigType = {
  id: VO.ProjectIdType;
  name: VO.TaskNameType;
};

class ProjectTaskNameIsUniqueFactory extends bg.Policy<ProjectTaskNameIsUniqueErrorConfigType> {
  async fails(
    config: ProjectTaskNameIsUniqueErrorConfigType
  ): Promise<boolean> {
    const numberOfProjectTasksWithName =
      await Repos.TaskRepository.countProjectTasksWithName(config);

    return numberOfProjectTasksWithName > 0;
  }

  message = "task.name.unique.error";

  error = ProjectTaskNameIsUniqueError;
}

export const ProjectTaskNameIsUnique = new ProjectTaskNameIsUniqueFactory();
