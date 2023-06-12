import * as bg from "@bgord/node";

import * as Aggregates from "../aggregates";

export class SettingsRepository {
  static async get() {
    const settings = await new Aggregates.Settings().build();

    return {
      email: settings.email,
      isWeeklyTrackersReportEnabled: settings.isWeeklyTrackersReportEnabled,
      updatedAt: bg.ComplexDate.falsy(settings.updatedAt),
    };
  }
}
