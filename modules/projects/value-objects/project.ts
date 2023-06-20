import * as bg from "@bgord/node";
import z from "zod";

import { ProjectId } from "./project-id";
import { ProjectName } from "./project-name";
import { ProjectCreatedAt } from "./project-created-at";
import { ProjectUpdatedAt } from "./project-updated-at";
import { ProjectStatus } from "./project-status";

export const Project = z.object({
  createdAt: ProjectCreatedAt,
  id: ProjectId,
  name: ProjectName,
  updatedAt: ProjectUpdatedAt,
  status: ProjectStatus,
});
export type ProjectType = z.infer<typeof Project>;

export type ProjectViewType = ProjectType & {
  createdAt: bg.RelativeDateType;
  updatedAt: bg.RelativeDateType;
};
