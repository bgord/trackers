import z from "zod";

import { TASK_NAME_STRUCTURE_ERROR_KEY } from "./task-name-structure-error-key";
import { TASK_NAME_MIN_LENGTH } from "./task-name-min-length";
import { TASK_NAME_MAX_LENGTH } from "./task-name-max-length";

export const TaskName = z
  .string()
  .min(TASK_NAME_MIN_LENGTH, { message: TASK_NAME_STRUCTURE_ERROR_KEY })
  .max(TASK_NAME_MAX_LENGTH, { message: TASK_NAME_STRUCTURE_ERROR_KEY });
export type TaskNameType = z.infer<typeof TaskName>;
