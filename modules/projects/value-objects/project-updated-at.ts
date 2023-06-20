import * as bg from "@bgord/node";
import { z } from "zod";

export const ProjectUpdatedAt =
  bg.Schema.Timestamp.brand<"project-updated-at">();

export type ProjectUpdatedAtType = z.infer<typeof ProjectUpdatedAt>;
