import type * as bg from "@bgord/frontend";
import type { AsyncReturnType } from "@bgord/node";

import type { TrackerDatapointRepository } from "../modules/trackers/repositories/tracker-datapoint-repository";
import type { SettingsRepository } from "../modules/settings/repositories";

// Types
export { TrackerKindEnum } from "../modules/trackers/value-objects/tracker-kind-enum";
export { TrackerStatusEnum } from "../modules/trackers/value-objects/tracker-status-enum";
export type { TrackerViewType as TrackerType } from "../modules/trackers/value-objects/tracker";
export type { EmailType } from "@bgord/node/dist/schema";
export type SettingsType = AsyncReturnType<typeof SettingsRepository["get"]>;
export type ToastType = bg.BaseToastType;
export type DatapointType = AsyncReturnType<
  typeof TrackerDatapointRepository["list"]
>[0];
export { GoalKindEnum } from "../modules/goals/value-objects/goal-kind-enum";
export { GoalStatusEnum } from "../modules/goals/value-objects/goal-status-enum";
export type { GoalType } from "../modules/goals/value-objects/goal";

// Constants

export { TRACKER_NAME_MIN_LENGTH } from "../modules/trackers/value-objects/tracker-name-min-length";
export { TRACKER_NAME_MAX_LENGTH } from "../modules/trackers/value-objects/tracker-name-max-length";

export { DATAPOINT_BOUND_LOWER } from "../modules/trackers/value-objects/datapoint-bound-lower";
export { DATAPOINT_BOUND_UPPER } from "../modules/trackers/value-objects/datapoint-bound-upper";

export { WEEKLY_TRACKERS_REPORT_UTC_HOUR } from "../modules/trackers/value-objects/weekly-trackers-report-utc-hour";

export { DATAPOINT_COMMENT_MAX_LENGTH } from "../modules/trackers/value-objects/datapoint-comment-max-length";
