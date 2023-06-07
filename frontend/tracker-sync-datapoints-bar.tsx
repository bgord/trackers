/* eslint-disable */
import * as bg from "@bgord/frontend";
import { h, Fragment } from "preact";

import * as types from "./types";
import { TrackerRevertDatapoint } from "./tracker-revert-datapoint";
import { TRACKER_SYNC_DATAPOINT_BOUND_LOWER } from "../value-objects/tracker-sync-datapoint-bound-lower";
import { TRACKER_SYNC_DATAPOINT_BOUND_UPPER } from "../value-objects/tracker-sync-datapoint-bound-upper";

export function TrackerSyncDatapointsBar(
  props: types.TrackerSyncDatapointType
) {
  const details = bg.useToggle(false);
  const toggleDetailsKeyboardHandler = bg.useKeyHandler({
    [bg.KeyNameEnum.Enter]: details.toggle,
    [bg.KeyNameEnum.Space]: details.toggle,
  });

  const hover = bg.useHover();
  const debouncedIsHovering = bg.useDebounce<boolean>({
    value: hover.isHovering,
    delayMs: 25,
  });

  const isActive = details.on || debouncedIsHovering;

  return (
    <li
      data-display="flex"
      data-direction="column"
      data-cursor={isActive ? "pointer" : "auto"}
      data-wrap="nowrap"
      onClick={details.toggle}
      onKeyDown={toggleDetailsKeyboardHandler}
      tabIndex={0}
      style={{ maxHeight: `${TRACKER_SYNC_DATAPOINT_BOUND_UPPER}px` }}
      {...hover.attach}
    >
      <div
        data-display="flex"
        data-main="center"
        data-cross="center"
        data-bg={isActive ? "gray-300" : "gray-200"}
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

      {isActive && (
        <Fragment>
          <div data-fs="12">{bg.DateFormatter.monthDay(props.createdAt)}</div>
          <TrackerRevertDatapoint {...props} />
        </Fragment>
      )}
    </li>
  );
}
