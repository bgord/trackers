import { z } from "zod";
import { TrackerValue } from "./tracker-value";

export const GoalTarget = TrackerValue.brand("goal-target");
export type GoalTargetType = z.infer<typeof GoalTarget>;
