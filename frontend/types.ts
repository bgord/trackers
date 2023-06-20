import type * as bg from "@bgord/frontend";
import type { AsyncReturnType } from "@bgord/node";

import type { TrackerDatapointRepository } from "../modules/trackers/repositories/tracker-datapoint-repository";
import type { SettingsRepository } from "../modules/settings/repositories";

// Types
export { TrackerKindEnum } from "../modules/trackers/value-objects/tracker-kind-enum";
export type { TrackerViewType as TrackerType } from "../modules/trackers/value-objects/tracker";
export type { EmailType } from "@bgord/node/dist/schema";
export type SettingsType = AsyncReturnType<typeof SettingsRepository["get"]>;
export type ToastType = bg.BaseToastType;
export type TrackerDatapointType = AsyncReturnType<
  typeof TrackerDatapointRepository["list"]
>[0];

export type { ProjectViewType as ProjectType } from "../modules/projects/value-objects/project";
export { ProjectStatusEnum } from "../modules/projects/value-objects/project-status-enum";

// Constants

export { TRACKER_NAME_MIN_LENGTH } from "../modules/trackers/value-objects/tracker-name-min-length";
export { TRACKER_NAME_MAX_LENGTH } from "../modules/trackers/value-objects/tracker-name-max-length";

export { TRACKER_DATAPOINT_BOUND_LOWER } from "../modules/trackers/value-objects/tracker-datapoint-bound-lower";
export { TRACKER_DATAPOINT_BOUND_UPPER } from "../modules/trackers/value-objects/tracker-datapoint-bound-upper";

export { PROJECT_NAME_MIN_LENGTH } from "../modules/projects/value-objects/project-name-min-length";
export { PROJECT_NAME_MAX_LENGTH } from "../modules/projects/value-objects/project-name-max-length";
