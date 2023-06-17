import type * as bg from "@bgord/frontend";
import type { AsyncReturnType } from "@bgord/node";

import type { TrackerDatapointRepository } from "../modules/trackers/repositories/tracker-datapoint-repository";
import type { SettingsRepository } from "../modules/settings/repositories";

export { TrackerKindEnum } from "../modules/trackers/value-objects/tracker-kind-enum";
export type { TrackerViewType as TrackerType } from "../modules/trackers/value-objects/tracker";
export type { EmailType } from "@bgord/node/dist/schema";
export type SettingsType = AsyncReturnType<typeof SettingsRepository["get"]>;
export type ToastType = bg.BaseToastType;
export type TrackerDatapointType = AsyncReturnType<
  typeof TrackerDatapointRepository["list"]
>[0];
