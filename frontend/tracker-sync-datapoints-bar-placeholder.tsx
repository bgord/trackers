import { h } from "preact";

import { TRACKER_SYNC_DATAPOINT_BOUND_LOWER } from "../value-objects/tracker-sync-datapoint-bound-lower";
import { TRACKER_SYNC_DATAPOINT_BOUND_UPPER } from "../value-objects/tracker-sync-datapoint-bound-upper";

export function TrackerSyncDatapointsPlaceholder(props: { bars: number }) {
  const min = TRACKER_SYNC_DATAPOINT_BOUND_LOWER;
  const max = TRACKER_SYNC_DATAPOINT_BOUND_UPPER;

  const bars = Array.from({ length: props.bars }).map(
    () => Math.floor(Math.random() * (max - min + 1)) + min
  );

  return (
    <ul data-display="flex" data-cross="end" data-gap="3">
      {bars.map((value, index) => (
        <TrackerSyncDatapointsPlaceholderBar key={index} height={value} />
      ))}
    </ul>
  );
}

function TrackerSyncDatapointsPlaceholderBar(props: { height: number }) {
  return (
    <li
      data-bg="gray-100"
      style={{ height: `${props.height}px`, width: "36px" }}
    ></li>
  );
}
