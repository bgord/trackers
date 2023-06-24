import { z } from "zod";
import { TrackerValue } from "../../trackers/value-objects/tracker-value";

export const GoalTarget = TrackerValue.brand("goal-target");
export type GoalTargetType = z.infer<typeof GoalTarget>;
