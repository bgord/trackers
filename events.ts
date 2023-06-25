import * as bg from "@bgord/node";
import Emittery from "emittery";

import * as Trackers from "./modules/trackers";
import * as Settings from "./modules/settings";
import * as Goals from "./modules/goals";

import * as infra from "./infra";

const EventLogger = new bg.EventLogger(infra.logger);

export const emittery = new Emittery<{
  TRACKER_ADDED_EVENT: Trackers.Events.TrackerAddedEventType;
  TRACKER_SYNCED_EVENT: Trackers.Events.TrackerSyncedEventType;
  TRACKER_REVERTED_EVENT: Trackers.Events.TrackerRevertedEventType;
  TRACKER_DELETED_EVENT: Trackers.Events.TrackerDeletedEventType;
  TRACKER_EXPORTED_EVENT: Trackers.Events.TrackerExportedEventType;
  TRACKER_NAME_CHANGED_EVENT: Trackers.Events.TrackerNameChangedEventType;
  TRACKER_ARCHIVED_EVENT: Trackers.Events.TrackerArchivedEventType;
  TRACKER_RESTORED_EVENT: Trackers.Events.TrackerRestoredEventType;
  TRACKER_VALUE_RECALCULATED_EVENT: Trackers.Events.TrackerValueRecalculatedEventType;
  WEEKLY_TRACKERS_REPORT_SCHEDULED: Trackers.Events.WeeklyTrackersReportScheduledEventType;

  WEEKLY_TRACKERS_REPORT_ENABLED: Settings.Events.WeeklyTrackersReportEnabledEventType;
  WEEKLY_TRACKERS_REPORT_DISABLED: Settings.Events.WeeklyTrackersReportDisabledEventType;
  SETTINGS_EMAIL_CHANGED: Settings.Events.SettingsEmailChangedEventType;
  SETTINGS_EMAIL_DELETED: Settings.Events.SettingsEmailDeletedEventType;

  GOAL_CREATED_EVENT: Goals.Events.GoalCreatedEventType;
  GOAL_DELETED_EVENT: Goals.Events.GoalDeletedEventType;
  GOAL_ACCOMPLISHED_EVENT: Goals.Events.GoalAccomplishedEventType;
}>({
  debug: { enabled: true, name: "infra/logger", logger: EventLogger.handle },
});

// Trackers ====================
emittery.on(
  Trackers.Events.TRACKER_ADDED_EVENT,
  Trackers.Handlers.onTrackerAddedEventHandler
);
emittery.on(
  Trackers.Events.TRACKER_SYNCED_EVENT,
  Trackers.Handlers.onTrackerSyncedEventHandler
);
emittery.on(
  Trackers.Events.TRACKER_REVERTED_EVENT,
  Trackers.Handlers.onTrackerRevertedEventHandler
);
emittery.on(
  Trackers.Events.TRACKER_DELETED_EVENT,
  Trackers.Handlers.onTrackerDeletedEventHandler
);
emittery.on(
  Trackers.Events.TRACKER_EXPORTED_EVENT,
  Trackers.Handlers.onTrackerExportedEventHandler
);
emittery.on(
  Trackers.Events.TRACKER_NAME_CHANGED_EVENT,
  Trackers.Handlers.onTrackerNameChangedEventHandler
);
emittery.on(
  Trackers.Events.TRACKER_ARCHIVED_EVENT,
  Trackers.Handlers.onTrackerArchivedEventHandler
);
emittery.on(
  Trackers.Events.TRACKER_RESTORED_EVENT,
  Trackers.Handlers.onTrackerRestoredEventHandler
);
emittery.on(
  Trackers.Events.WEEKLY_TRACKERS_REPORT_SCHEDULED,
  Trackers.Handlers.onWeeklyTrackersReportScheduledEventHandler
);
// =============================

// Goals =======================
emittery.on(
  Goals.Events.GOAL_CREATED_EVENT,
  Goals.Handlers.onGoalCreatedEventHandler
);
emittery.on(
  Goals.Events.GOAL_DELETED_EVENT,
  Goals.Handlers.onGoalDeletedEventHandler
);
emittery.on(
  Goals.Events.GOAL_ACCOMPLISHED_EVENT,
  Goals.Handlers.onGoalAccomplishedEventHandler
);
// =============================
