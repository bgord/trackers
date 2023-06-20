/* eslint-ignore */
import { z } from "zod";

import { ProjectStatusEnum } from "./project-status-enum";

export const ProjectStatus = z
  .nativeEnum(ProjectStatusEnum)
  .default(ProjectStatusEnum.active);

export type ProjectStatusType = z.infer<typeof ProjectStatus>;
