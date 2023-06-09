import * as bg from "@bgord/node";

import * as Events from "../events";
import * as Repos from "../repositories";
import * as Policies from "../policies";
import * as VO from "../value-objects";

export class Settings {
  stream: bg.EventType["stream"];

  isWeeklyTrackersReportEnabled: VO.SettingsWeeklyTrackersReportEnabledType =
    VO.SETTINGS_WEEKLY_TRACKERS_REPORT_ENABLED_DEFAULT_VALUE;

  email: VO.SettingsType["email"] = null;

  constructor() {
    this.stream = Settings.getStream();
  }

  async build() {
    const events = await Repos.EventRepository.find(
      [
        Events.WeeklyTrackersReportEnabledEvent,
        Events.WeeklyTrackersReportDisabledEvent,
        Events.SettingsEmailChangedEvent,
      ],
      this.stream
    );

    for (const event of events) {
      switch (event.name) {
        case Events.WEEKLY_TRACKERS_REPORT_ENABLED:
          this.isWeeklyTrackersReportEnabled = true;
          break;

        case Events.WEEKLY_TRACKERS_REPORT_DISABLED:
          this.isWeeklyTrackersReportEnabled = false;
          break;

        case Events.SETTINGS_EMAIL_CHANGED:
          this.email = event.payload.email;
          break;

        default:
          continue;
      }
    }

    return this;
  }

  async enableWeeklyTrackersReport() {
    await Policies.WeeklyTrackersReportIsDisabled.perform({
      current: this.isWeeklyTrackersReportEnabled,
    });

    await Repos.EventRepository.save(
      Events.WeeklyTrackersReportEnabledEvent.parse({
        name: Events.WEEKLY_TRACKERS_REPORT_ENABLED,
        stream: this.stream,
        version: 1,
        payload: { updatedAt: Date.now() },
      })
    );
  }

  async disableWeeklyTrackersReport() {
    await Policies.WeeklyTrackersReportIsEnabled.perform({
      current: this.isWeeklyTrackersReportEnabled,
    });

    await Repos.EventRepository.save(
      Events.WeeklyTrackersReportDisabledEvent.parse({
        name: Events.WEEKLY_TRACKERS_REPORT_DISABLED,
        stream: this.stream,
        version: 1,
        payload: { updatedAt: Date.now() },
      })
    );
  }

  async changeEmail(email: VO.SettingsEmailType) {
    await Repos.EventRepository.save(
      Events.SettingsEmailChangedEvent.parse({
        name: Events.SETTINGS_EMAIL_CHANGED,
        stream: this.stream,
        version: 1,
        payload: { email, updatedAt: Date.now() },
      })
    );
  }

  static getStream() {
    return "settings";
  }
}
