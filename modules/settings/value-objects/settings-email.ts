import * as bg from "@bgord/node";
import { z } from "zod";

export const SettingsEmail = bg.Schema.Email.brand<"settings-email">();

export type SettingsEmailType = z.infer<typeof SettingsEmail>;
