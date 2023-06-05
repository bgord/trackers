import type * as bg from "@bgord/frontend";
import type { AsyncReturnType } from "@bgord/node";

import type { TrackerSyncDatapointRepository } from "../repositories/tracker-sync-datapoint-repository";

export type { TrackerNameType } from "../value-objects/tracker-name";
export type ToastType = bg.BaseToastType;

export { TrackerKindEnum } from "../value-objects/tracker-kind-enum";

export type { TrackerType } from "../value-objects/tracker";

export type TrackerSyncDatapointType = AsyncReturnType<
  typeof TrackerSyncDatapointRepository["list"]
>[0];
