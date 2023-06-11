import { ToadScheduler, AsyncTask, CronJob } from "toad-scheduler";

import * as Aggregates from "../aggregates";
import * as Services from "../services";
import { logger } from "./logger";

export const Scheduler = new ToadScheduler();

const WeeklyTrackersReportSchedulerTask = new AsyncTask(
  "weekly-trackers-report-scheduler-task",
  async () => {
    try {
      logger.info({
        message: "WeeklyTrackersReportSchedulerTask start",
        operation: "weekly_trackers_report_scheduler_task_start",
      });

      const settings = await new Aggregates.Settings().build();
      await Services.WeeklyTrackersReportScheduler.schedule(settings);

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

const WeeklyTrackersReportSchedulerJob = new CronJob(
  {
    cronExpression: Services.WeeklyTrackersReportScheduler.getCronExpression(),
  },
  WeeklyTrackersReportSchedulerTask
);

Scheduler.addCronJob(WeeklyTrackersReportSchedulerJob);
