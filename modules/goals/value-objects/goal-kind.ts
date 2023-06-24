import { z } from "zod";

import { GoalKindEnum } from "./goal-kind-enum";
import { GOAL_KIND_ERROR_KEY } from "./goal-kind-error-key";

export const GoalKind = z.nativeEnum(GoalKindEnum, {
  errorMap: () => ({ message: GOAL_KIND_ERROR_KEY }),
});

export type GoalKindType = z.infer<typeof GoalKind>;
