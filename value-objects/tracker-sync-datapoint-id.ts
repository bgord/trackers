import * as bg from "@bgord/node";
import { z } from "zod";

export const TrackerSyncDatapointId =
  bg.Schema.UUID.brand<"tracker-sync-datapoint-id">();

export type TrackerSyncDatapointIdType = z.infer<typeof TrackerSyncDatapointId>;
