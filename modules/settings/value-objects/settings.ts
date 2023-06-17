import * as bg from "@bgord/node";
import { z } from "zod";

import { SettingsWeeklyTrackersReportEnabled } from "./settings-weekly-trackers-report-enabled";
import { SettingsEmail } from "./settings-email";

export const Settings = z.object({
  weeklyTrackersReportEnabled: SettingsWeeklyTrackersReportEnabled,
  email: SettingsEmail.nullable(),
  updatedAt: bg.Schema.Timestamp.nullable(),
});

export type SettingsType = z.infer<typeof Settings>;
