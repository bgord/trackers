import * as bg from "@bgord/node";
import { z } from "zod";

export const TrackerDatapointId =
  bg.Schema.UUID.brand<"tracker-datapoint-id">();

export type TrackerDatapointIdType = z.infer<typeof TrackerDatapointId>;
