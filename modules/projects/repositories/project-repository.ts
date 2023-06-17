import * as bg from "@bgord/node";
import { z } from "zod";

import * as infra from "../../../infra";
import * as VO from "../value-objects";

export class ProjectRepository {
  static async create(payload: VO.ProjectType) {
    return infra.db.project.create({
      data: { ...payload, updatedAt: payload.createdAt },
    });
  }

  static async list() {
    const projects = await infra.db.project.findMany();

    return z
      .array(VO.Project)
      .parse(projects)
      .map((project) => ({
        ...project,
        createdAt: bg.RelativeDate.to.now.truthy(project.createdAt),
        updatedAt: bg.RelativeDate.to.now.truthy(project.updatedAt),
      }));
  }
}
