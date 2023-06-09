import * as bg from "@bgord/node";

import * as VO from "../value-objects";

export class WeeklyTrackersReportIsEnabledError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, WeeklyTrackersReportIsEnabledError.prototype);
  }
}

type WeeklyTrackersReportIsEnabledConfigType = {
  current: VO.SettingsWeeklyTrackersReportEnabledType;
};

class WeeklyTrackersReportIsEnabledFactory extends bg.Policy<WeeklyTrackersReportIsEnabledConfigType> {
  async fails(
    config: WeeklyTrackersReportIsEnabledConfigType
  ): Promise<boolean> {
    return config.current === false;
  }

  error = WeeklyTrackersReportIsEnabledError;
}

export const WeeklyTrackersReportIsEnabled =
  new WeeklyTrackersReportIsEnabledFactory();
