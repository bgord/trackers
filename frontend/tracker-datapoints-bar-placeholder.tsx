import { h } from "preact";

import * as types from "./types";

export function TrackerDatapointsChartPlaceholder(props: { bars: number }) {
  const min = types.TRACKER_DATAPOINT_BOUND_LOWER;
  const max = types.TRACKER_DATAPOINT_BOUND_UPPER;

  const bars = Array.from({ length: props.bars - 1 }).map(
    () => Math.floor(Math.random() * (max - min + 1)) + min
  );

  // Make sure at least one bar is at maximum height
  bars.push(max);

  return (
    <ul
      data-display="flex"
      data-cross="end"
      data-gap="3"
      data-bwy="1"
      data-bcy="gray-200"
      data-py="3"
      style={{ minHeight: `${max}px` }}
    >
      {bars.map((value, index) => (
        /* eslint-disable react/no-array-index-key */
        <TrackerDatapointBarPlaceholder key={index} height={value} />
      ))}
    </ul>
  );
}

function TrackerDatapointBarPlaceholder(props: { height: number }) {
  return (
    <li
      data-bg="gray-100"
      style={{ height: `${props.height}px`, width: "36px" }}
    ></li>
  );
}
