import * as Aggregates from "../aggregates";

export class SettingsRepository {
  static async get() {
    const settings = await new Aggregates.Settings().build();

    return {
      isWeeklyTrackersReportEnabled: settings.isWeeklyTrackersReportEnabled,
    };
  }
}
