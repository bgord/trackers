/* eslint-disable */
import * as bg from "@bgord/frontend";
import { h } from "preact";

import * as types from "./types";
import { TRACKER_SYNC_DATAPOINT_BOUND_LOWER } from "../value-objects/tracker-sync-datapoint-bound-lower";
import { TRACKER_SYNC_DATAPOINT_BOUND_UPPER } from "../value-objects/tracker-sync-datapoint-bound-upper";

export function TrackerSyncDatapointsBar(
  props: types.TrackerSyncDatapointType
) {
  const details = bg.useToggle(false);

  const { isHovering, attach } = bg.useHover();
  const debouncedIsHovering = bg.useDebounce<boolean>({
    value: isHovering,
    delayMs: 25,
  });

  const isInteractive = details.on || debouncedIsHovering;

  return (
    <li
      data-display="flex"
      data-direction="column"
      data-cursor={isInteractive ? "pointer" : "auto"}
      onClick={details.toggle}
      onKeyDown={(event) => {
        [13, 32].includes(event.keyCode) ? details.toggle() : bg.noop();
      }}
      tabIndex={0}
      {...attach}
    >
      <div
        data-display="flex"
        data-main="center"
        data-cross="center"
        data-bg={isInteractive ? "gray-300" : "gray-200"}
        data-px="3"
        data-fs="12"
        data-bwb={props.value.isMin ? "4" : undefined}
        data-bcb={props.value.isMin ? "gray-400" : undefined}
        data-bwt={props.value.isMax ? "4" : undefined}
        data-bct={props.value.isMax ? "gray-400" : undefined}
        style={{
          minHeight: `${TRACKER_SYNC_DATAPOINT_BOUND_LOWER}px`,
          height: `${props.value.scaled}px`,
          minWidth: "36px",
        }}
      >
        {props.value.actual}
      </div>

      {isInteractive && (
        <div data-fs="12">{bg.DateFormatter.monthDay(props.createdAt)}</div>
      )}
    </li>
  );
}
