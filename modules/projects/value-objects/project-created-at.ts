import * as bg from "@bgord/node";
import { z } from "zod";

export const ProjectCreatedAt =
  bg.Schema.Timestamp.brand<"project-created-at">();

export type ProjectCreatedAtType = z.infer<typeof ProjectCreatedAt>;
