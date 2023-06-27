import * as Goals from "../../goals";
import * as Trackers from "../../trackers";
import * as Settings from "../../settings";

export class GoalAccomplishedNotificationScheduler {
  static async schedule(
    event: Goals.Events.GoalAccomplishedEventType,
    settings: Settings.Aggregates.Settings
  ) {
    await Settings.Policies.SettingsEmailIsConfigured.perform({
      email: settings.email,
    });

    const [goal, tracker] = await Promise.all([
      Goals.Repos.GoalRepository.getById({ id: event.payload.id }),
      Trackers.Repos.TrackerRepository.getById({ id: event.payload.trackerId }),
    ]);

    if (!goal) throw Goals.Policies.GoalShouldExist;
    if (!tracker) throw Trackers.Policies.TrackerShouldExist;
  }
}
