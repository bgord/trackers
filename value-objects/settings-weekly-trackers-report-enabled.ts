import { z } from "zod";

import { SETTINGS_WEEKLY_TRACKERS_REPORT_ENABLED_DEFAULT_VALUE } from "./settings-weekly-trackers-report-enabled-default-value";

export const SettingsWeeklyTrackersReportEnabled = z
  .boolean()
  .default(SETTINGS_WEEKLY_TRACKERS_REPORT_ENABLED_DEFAULT_VALUE);

export type SettingsWeeklyTrackersReportEnabledType = z.infer<
  typeof SettingsWeeklyTrackersReportEnabled
>;
