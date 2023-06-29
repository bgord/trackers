import * as bg from "@bgord/node";
import { z } from "zod";

export const DatapointId = bg.Schema.UUID.brand<"datapoint-id">();
export type DatapointIdType = z.infer<typeof DatapointId>;
