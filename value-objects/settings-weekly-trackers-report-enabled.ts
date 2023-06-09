import { z } from "zod";

export const SettingsWeeklyTrackersReportEnabled = z
  .boolean()
  .brand<"settings-weekly-trackers-report-enabled">()
  .default(false);

export type SettingsWeeklyTrackersReportEnabledType = z.infer<
  typeof SettingsWeeklyTrackersReportEnabled
>;
