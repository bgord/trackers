import { z } from "zod";

import { SettingsWeeklyTrackersReportEnabled } from "./settings-weekly-trackers-report-enabled";

export const Settings = z.object({
  weeklyTrackersReportEnabled: SettingsWeeklyTrackersReportEnabled,
});

export type SettingsType = z.infer<typeof Settings>;
