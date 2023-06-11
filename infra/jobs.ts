import { ToadScheduler, AsyncTask, CronJob } from "toad-scheduler";

import * as Services from "../services";
import { logger } from "./logger";

export const Scheduler = new ToadScheduler();

const WeeklyTrackersReportSchedulerTask = new AsyncTask(
  "weekly-trackers-report-scheduler-task",
  async () => {
    logger.info({
      message: "WeeklyTrackersReportSchedulerTask start",
      operation: "weekly_trackers_report_scheduler_task_start",
    });
  }
);

const WeeklyTrackersReportSchedulerJob = new CronJob(
  {
    cronExpression: `0 ${Services.WeeklyTrackersReportScheduler.UTC_HOUR} * * ${Services.WeeklyTrackersReportScheduler.DAY_OF_THE_WEEK}`,
  },
  WeeklyTrackersReportSchedulerTask
);

Scheduler.addCronJob(WeeklyTrackersReportSchedulerJob);
