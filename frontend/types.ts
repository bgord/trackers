import type * as bg from "@bgord/frontend";
import type { AsyncReturnType } from "@bgord/node";

export type { EmailType } from "@bgord/node/dist/schema";

import type { TrackerDatapointRepository } from "../repositories/tracker-datapoint-repository";
import type { SettingsRepository } from "../modules/settings/repositories";

export type { TrackerNameType } from "../value-objects/tracker-name";

export type ToastType = bg.BaseToastType;

export { TrackerKindEnum } from "../value-objects/tracker-kind-enum";

import type { TrackerViewType } from "../value-objects/tracker";
export type TrackerType = TrackerViewType;

export type TrackerDatapointType = AsyncReturnType<
  typeof TrackerDatapointRepository["list"]
>[0];

export type SettingsType = AsyncReturnType<typeof SettingsRepository["get"]>;

export type { SettingsEmailType } from "../modules/settings/value-objects";
