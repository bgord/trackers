import { Cron } from "croner";

import * as Settings from "../modules/settings";
import * as Trackers from "../modules/trackers";

import { logger } from "./logger";

const WeeklyTrackersReportSchedulerJob = Cron(
  Trackers.Services.WeeklyTrackersReportScheduler.getCronExpression(),
  async () => {
    try {
      logger.info({
        message: "WeeklyTrackersReportSchedulerTask start",
        operation: "weekly_trackers_report_scheduler_task_start",
      });

      const settings = await new Settings.Aggregates.Settings().build();
      await Trackers.Services.WeeklyTrackersReportScheduler.schedule(settings);

      logger.info({
        message: "WeeklyTrackersReportSchedulerTask success",
        operation: "weekly_trackers_report_scheduler_task_success",
      });
    } catch (error) {
      logger.info({
        message: "WeeklyTrackersReportSchedulerTask error",
        operation: "weekly_trackers_report_scheduler_task_error",
        metadata: logger.formatError(error),
      });
    }
  }
);

export const jobs = { WeeklyTrackersReportSchedulerJob };
