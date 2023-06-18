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
