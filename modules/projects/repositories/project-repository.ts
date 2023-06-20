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

  static async delete(payload: Pick<VO.ProjectType, "id">) {
    return infra.db.project.delete({ where: { id: payload.id } });
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

  static async archive(config: {
    id: VO.ProjectType["id"];
    updatedAt: bg.Schema.TimestampType;
  }) {
    return infra.db.project.update({
      where: { id: config.id },
      data: { status: VO.ProjectStatusEnum.archived },
    });
  }

  static async countProjectsWithName(name: VO.ProjectType["name"]) {
    return infra.db.project.count({ where: { name } });
  }
}
