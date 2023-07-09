import type * as bg from "@bgord/frontend";
import type { AsyncReturnType } from "@bgord/node";

import type { DatapointRepository } from "../modules/trackers/repositories/datapoint-repository";
import type { SettingsRepository } from "../modules/settings/repositories";
import type { HistoryRepository } from "../modules/history/repositories";

// Types
export { TrackerKindEnum } from "../modules/trackers/value-objects/tracker-kind-enum";
export { TrackerStatusEnum } from "../modules/trackers/value-objects/tracker-status-enum";
export type { TrackerViewType as TrackerType } from "../modules/trackers/value-objects/tracker";
export type { EmailType } from "@bgord/node/dist/schema";
export type SettingsType = AsyncReturnType<typeof SettingsRepository["get"]>;
export type ToastType = bg.BaseToastType;
export type DatapointType = AsyncReturnType<
  typeof DatapointRepository["list"]
>[0];
export { GoalKindEnum } from "../modules/goals/value-objects/goal-kind-enum";
export { GoalStatusEnum } from "../modules/goals/value-objects/goal-status-enum";
export type { GoalType } from "../modules/goals/value-objects/goal";

export type HistoryType = AsyncReturnType<
  typeof HistoryRepository["pagedList"]
>["result"][0];

export type HistoryViewType = HistoryType & { payload: Record<string, any> };

// Constants

export { TRACKER_VALUE_DEFAULT } from "../modules/trackers/value-objects/tracker-value-default";

export { TRACKER_NAME_MIN_LENGTH } from "../modules/trackers/value-objects/tracker-name-min-length";
export { TRACKER_NAME_MAX_LENGTH } from "../modules/trackers/value-objects/tracker-name-max-length";

export { DATAPOINT_BOUND_LOWER } from "../modules/trackers/value-objects/datapoint-bound-lower";
export { DATAPOINT_BOUND_UPPER } from "../modules/trackers/value-objects/datapoint-bound-upper";

export { WEEKLY_TRACKERS_REPORT_UTC_HOUR } from "../modules/trackers/value-objects/weekly-trackers-report-utc-hour";

export { DATAPOINT_COMMENT_MAX_LENGTH } from "../modules/trackers/value-objects/datapoint-comment-max-length";

export { GOAL_TARGET_DEFAULT_VALUE } from "../modules/goals/value-objects/goal-target-default-value";

export { SETTINGS_EMAIL_MAX_LENGTH } from "../modules/settings/value-objects/settings-email-max-length";
