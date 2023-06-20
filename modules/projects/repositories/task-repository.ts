import * as bg from "@bgord/node";
import { z } from "zod";

import * as infra from "../../../infra";
import * as VO from "../value-objects";

export class TaskRepository {
  static async create(payload: VO.TaskType) {
    return infra.db.task.create({
      data: { ...payload, updatedAt: payload.createdAt },
    });
  }

  static async list(payload: { projectId: VO.ProjectIdType }) {
    const tasks = await infra.db.task.findMany({
      where: { projectId: { equals: payload.projectId } },
    });

    return z
      .array(VO.Task)
      .parse(tasks)
      .map((task) => ({
        ...task,
        createdAt: bg.RelativeDate.to.now.truthy(task.createdAt),
        updatedAt: bg.RelativeDate.to.now.truthy(task.updatedAt),
      }));
  }

  static async countProjectTasksWithName(payload: {
    id: VO.ProjectIdType;
    name: VO.TaskNameType;
  }) {
    return infra.db.task.count({
      where: { projectId: payload.id, name: payload.name },
    });
  }
}
