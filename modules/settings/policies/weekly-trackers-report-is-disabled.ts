import * as bg from "@bgord/node";

import * as VO from "../value-objects";

export class WeeklyTrackersReportIsDisabledError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, WeeklyTrackersReportIsDisabledError.prototype);
  }
}

type WeeklyTrackersReportIsDisabledConfigType = {
  current: VO.SettingsWeeklyTrackersReportEnabledType;
};

class WeeklyTrackersReportIsDisabledFactory extends bg.Policy<WeeklyTrackersReportIsDisabledConfigType> {
  async fails(
    config: WeeklyTrackersReportIsDisabledConfigType
  ): Promise<boolean> {
    return config.current === true;
  }

  message = "settings.weekly_trackers_report.disable.error";

  error = WeeklyTrackersReportIsDisabledError;
}

export const WeeklyTrackersReportIsDisabled =
  new WeeklyTrackersReportIsDisabledFactory();
