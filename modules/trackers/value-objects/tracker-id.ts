import * as bg from "@bgord/node";
import { z } from "zod";

export const TrackerId = bg.Schema.UUID.brand<"tracker-id">();

export type TrackerIdType = z.infer<typeof TrackerId>;
