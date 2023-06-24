import * as bg from "@bgord/node";
import z from "zod";

import { GoalCreatedAt } from "./goal-created-at";
import { GoalId } from "./goal-id";
import { GoalKind } from "./goal-kind";
import { GoalRelatedTrackerId } from "./goal-related-tracker-id";
import { GoalStatus } from "./goal-status";
import { GoalTarget } from "./goal-target";
import { GoalUpdatedAt } from "./goal-updated-at";

export const Goal = z.object({
  createdAt: GoalCreatedAt,
  id: GoalId,
  kind: GoalKind,
  relatedTrackerId: GoalRelatedTrackerId,
  status: GoalStatus,
  target: GoalTarget,
  updatedAt: GoalUpdatedAt,
});
export type GoalType = z.infer<typeof Goal>;

export type GoalViewType = GoalType & {
  createdAt: bg.RelativeDateType;
  updatedAt: bg.RelativeDateType;
};
