import { ToadScheduler, SimpleIntervalJob, AsyncTask } from "toad-scheduler";

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

const WeeklyTrackersReportSchedulerJob = new SimpleIntervalJob(
  { seconds: 10, runImmediately: true },
  WeeklyTrackersReportSchedulerTask
);

Scheduler.addSimpleIntervalJob(WeeklyTrackersReportSchedulerJob);
