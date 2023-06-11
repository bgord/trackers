import * as bg from "@bgord/node";

import * as Aggregates from "../aggregates";
import * as Policies from "../policies";

export enum DayOfTheWeekEnum {
  Monday = 0,
  Tuesday = 1,
  Wednesday = 2,
  Thursday = 3,
  Friday = 4,
  Saturday = 5,
  Sunday = 6,
}

export class WeeklyTrackersReportScheduler {
  static DAY_OF_THE_WEEK: DayOfTheWeekEnum = DayOfTheWeekEnum.Monday;

  static UTC_HOUR: bg.Schema.HourType = 9;

  static async schedule(settings: Aggregates.Settings) {
    await Policies.WeeklyTrackersReportIsEnabled.perform({
      current: settings.isWeeklyTrackersReportEnabled,
    });
    await Policies.MinimumOneTrackerExists.perform({});
    await Policies.SettingsEmailIsConfigured.perform({ email: settings.email });
  }
}
