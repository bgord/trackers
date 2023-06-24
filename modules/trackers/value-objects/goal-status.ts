import { z } from "zod";

import { GoalStatusEnum } from "./goal-status-enum";
import { GOAL_STATUS_ERROR_KEY } from "./goal-status-error-key";

export const GoalStatus = z.nativeEnum(GoalStatusEnum, {
  errorMap: () => ({ message: GOAL_STATUS_ERROR_KEY }),
});

export type GoalStatusType = z.infer<typeof GoalStatus>;
