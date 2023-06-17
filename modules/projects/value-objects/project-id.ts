import * as bg from "@bgord/node";
import { z } from "zod";

export const ProjectId = bg.Schema.UUID.brand<"project-id">();

export type ProjectIdType = z.infer<typeof ProjectId>;
