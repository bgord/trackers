import * as bg from "@bgord/frontend";
import { h } from "preact";

import * as types from "./types";

const min = types.DATAPOINT_BOUND_LOWER;
const max = types.DATAPOINT_BOUND_UPPER;

export function DatapointsChartPlaceholder() {
  const isMobile = bg.useBreakpoint(768);

  const numberOfBars = isMobile ? 7 : 18;
  const bars = generateBars(numberOfBars);

  return (
    <ul
      data-display="flex"
      data-cross="end"
      data-gap="3"
      data-bwy="1"
      data-bcy="gray-200"
      data-py="3"
      style={bg.Rhythm.base(max).times(1).minHeight}
    >
      {bars.map((value, index) => (
        /* eslint-disable react/no-array-index-key */
        <DatapointBarPlaceholder key={index} height={value} />
      ))}
    </ul>
  );
}

function DatapointBarPlaceholder(props: { height: number }) {
  return (
    <li
      data-bg="gray-100"
      style={{
        ...bg.Rhythm.base().times(3).width,
        ...bg.Rhythm.base(props.height).times(1).height,
      }}
    ></li>
  );
}

function generateBars(numberOfBars: number) {
  const bars = Array.from({ length: numberOfBars - 1 }).map(
    () => Math.floor(Math.random() * (max - min + 1)) + min
  );

  // Make sure at least one bar is at maximum height
  bars.push(max);

  return bars;
}
