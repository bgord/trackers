import * as bg from "@bgord/node";
import z from "zod";

import * as VO from "./value-objects";

export const PROJECT_CREATED = "PROJECT_CREATED";
export const ProjectCreatedEvent = bg.EventDraft.merge(
  z.object({
    name: z.literal(PROJECT_CREATED),
    version: z.literal(1),
    payload: VO.Project,
  })
);
export type ProjectCreatedEventType = z.infer<typeof ProjectCreatedEvent>;
