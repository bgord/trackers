import { z } from "zod";

import { WeeklyTrackersReportHtml } from "./weekly-trackers-report-html";
import { WeeklyTrackersReportSubject } from "./weekly-trackers-report-subject";

export const WeeklyTrackersReport = z.object({
  html: WeeklyTrackersReportHtml,
  subject: WeeklyTrackersReportSubject,
});

export type WeeklyTrackersReportType = z.infer<typeof WeeklyTrackersReport>;
