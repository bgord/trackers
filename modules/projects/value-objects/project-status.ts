/* eslint-ignore */
import { z } from "zod";

export enum ProjectStatusEnum {
  "active" = "active",
  "archived" = "archived",
}

export const ProjectStatus = z
  .nativeEnum(ProjectStatusEnum)
  .default(ProjectStatusEnum.active);

export type ProjectStatusType = z.infer<typeof ProjectStatus>;
