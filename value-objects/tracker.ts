import * as bg from "@bgord/node";
import z from "zod";

import { TrackerCreatedAt } from "./tracker-created-at";
import { TrackerId } from "./tracker-id";
import { TrackerKind } from "./tracker-kind";
import { TrackerName } from "./tracker-name";
import { TrackerUpdatedAt } from "./tracker-updated-at";
import { TrackerValue } from "./tracker-value";

export const Tracker = z.object({
  createdAt: TrackerCreatedAt,
  id: TrackerId,
  kind: TrackerKind,
  name: TrackerName,
  updatedAt: TrackerUpdatedAt,
  value: TrackerValue,
});
export type TrackerType = z.infer<typeof Tracker>;

export type TrackerViewType = TrackerType & {
  createdAt: bg.RelativeDateType;
  updatedAt: bg.RelativeDateType;
};
