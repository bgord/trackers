import { z } from "zod";

export const WeeklyTrackersReportSubject = z.string().min(1);

export type WeeklyTrackersReportSubjectType = z.infer<
  typeof WeeklyTrackersReportSubject
>;
