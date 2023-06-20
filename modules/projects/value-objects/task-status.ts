/* eslint-ignore */
import { z } from "zod";

import { TaskStatusEnum } from "./task-status-enum";

export const TaskStatus = z
  .nativeEnum(TaskStatusEnum)
  .default(TaskStatusEnum.active);

export type TaskStatusType = z.infer<typeof TaskStatus>;
