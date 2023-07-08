import * as bg from "@bgord/node";
import { z } from "zod";

import { SETTINGS_EMAIL_MAX_LENGTH } from "./settings-email-max-length";
import { SETTINGS_EMAIL_STRUCTURE_ERROR_KEY } from "./settings-email-structure-error-key";

export const SettingsEmail = bg.Schema.Email.max(SETTINGS_EMAIL_MAX_LENGTH, {
  message: SETTINGS_EMAIL_STRUCTURE_ERROR_KEY,
}).brand<"settings-email">();

export type SettingsEmailType = z.infer<typeof SettingsEmail>;
