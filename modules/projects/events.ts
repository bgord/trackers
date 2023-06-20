import * as bg from "@bgord/node";
import z from "zod";

import * as VO from "./value-objects";

export const PROJECT_CREATED_EVENT = "PROJECT_CREATED_EVENT";
export const ProjectCreatedEvent = bg.EventDraft.merge(
  z.object({
    name: z.literal(PROJECT_CREATED_EVENT),
    version: z.literal(1),
    payload: VO.Project,
  })
);
export type ProjectCreatedEventType = z.infer<typeof ProjectCreatedEvent>;

export const PROJECT_DELETED_EVENT = "PROJECT_DELETED_EVENT";
export const ProjectDeletedEvent = bg.EventDraft.merge(
  z.object({
    name: z.literal(PROJECT_DELETED_EVENT),
    version: z.literal(1),
    payload: z.object({ id: VO.ProjectId, deletedAt: bg.Schema.Timestamp }),
  })
);
export type ProjectDeletedEventType = z.infer<typeof ProjectDeletedEvent>;

export const PROJECT_ARCHIVED_EVENT = "PROJECT_ARCHIVED_EVENT";
export const ProjectArchivedEvent = bg.EventDraft.merge(
  z.object({
    name: z.literal(PROJECT_ARCHIVED_EVENT),
    version: z.literal(1),
    payload: z.object({ id: VO.ProjectId, archivedAt: bg.Schema.Timestamp }),
  })
);
export type ProjectArchivedEventType = z.infer<typeof ProjectArchivedEvent>;

export const PROJECT_RESTORED_EVENT = "PROJECT_RESTORED_EVENT";
export const ProjectRestoredEvent = bg.EventDraft.merge(
  z.object({
    name: z.literal(PROJECT_RESTORED_EVENT),
    version: z.literal(1),
    payload: z.object({ id: VO.ProjectId, restoredAt: bg.Schema.Timestamp }),
  })
);
export type ProjectRestoredEventType = z.infer<typeof ProjectRestoredEvent>;

export const TASK_CREATED_EVENT = "TASK_CREATED_EVENT";
export const TaskCreatedEvent = bg.EventDraft.merge(
  z.object({
    name: z.literal(TASK_CREATED_EVENT),
    version: z.literal(1),
    payload: VO.Task,
  })
);
export type TaskCreatedEventType = z.infer<typeof TaskCreatedEvent>;
