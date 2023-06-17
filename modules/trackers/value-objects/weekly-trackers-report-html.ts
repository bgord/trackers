import { z } from "zod";

export const WeeklyTrackersReportHtml = z.string().min(1);

export type WeeklyTrackersReportHtmlType = z.infer<
  typeof WeeklyTrackersReportHtml
>;
