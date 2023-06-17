import * as bg from "@bgord/node";

import * as Settings from "../modules/settings";

import * as Policies from "../policies";
import * as Repos from "../repositories";
import * as Events from "../events";

export enum DayOfTheWeekEnum {
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6,
  Sunday = 0,
}

export class WeeklyTrackersReportScheduler {
  static DAY_OF_THE_WEEK: DayOfTheWeekEnum = DayOfTheWeekEnum.Monday;

  static UTC_HOUR: bg.Schema.HourType = 5;

  static getCronExpression() {
    const { UTC_HOUR, DAY_OF_THE_WEEK } = WeeklyTrackersReportScheduler;

    return `0 ${UTC_HOUR} * * ${DAY_OF_THE_WEEK}`;
  }

  static async schedule(settings: Settings.Aggregates.Settings) {
    // TODO: Settings module leaks
    await Settings.Policies.WeeklyTrackersReportIsEnabled.perform({
      current: settings.isWeeklyTrackersReportEnabled,
    });

    await Policies.MinimumOneTrackerExists.perform({});

    // TODO: Settings module leaks
    await Settings.Policies.SettingsEmailIsConfigured.perform({
      email: settings.email,
    });

    await Repos.EventRepository.save(
      Events.WeeklyTrackersReportScheduledEvent.parse({
        name: Events.WEEKLY_TRACKERS_REPORT_SCHEDULED,
        stream: "weekly-trackers-report",
        version: 1,
        payload: { scheduledAt: Date.now(), email: settings.email },
      })
    );
  }
}
