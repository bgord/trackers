import * as bg from "@bgord/node";
import z from "zod";

import { TaskId } from "./task-id";
import { TaskName } from "./task-name";
import { TaskCreatedAt } from "./task-created-at";
import { TaskUpdatedAt } from "./task-updated-at";

export const Task = z.object({
  createdAt: TaskCreatedAt,
  id: TaskId,
  name: TaskName,
  updatedAt: TaskUpdatedAt,
});
export type TaskType = z.infer<typeof Task>;

export type TaskViewType = TaskType & {
  createdAt: bg.RelativeDateType;
  updatedAt: bg.RelativeDateType;
};
