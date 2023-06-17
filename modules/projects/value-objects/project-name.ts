import z from "zod";

import { PROJECT_NAME_STRUCTURE_ERROR_KEY } from "./project-name-structure-error-key";
import { PROJECT_NAME_MIN_LENGTH } from "./project-name-min-length";
import { PROJECT_NAME_MAX_LENGTH } from "./project-name-max-length";

export const ProjectName = z
  .string()
  .min(PROJECT_NAME_MIN_LENGTH, { message: PROJECT_NAME_STRUCTURE_ERROR_KEY })
  .max(PROJECT_NAME_MAX_LENGTH, { message: PROJECT_NAME_STRUCTURE_ERROR_KEY });
export type ProjectNameType = z.infer<typeof ProjectName>;
