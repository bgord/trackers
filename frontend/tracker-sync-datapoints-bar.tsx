import * as bg from "@bgord/frontend";
import { h } from "preact";

import * as types from "./types";

export function TrackerSyncDatapointsBar(
  props: types.TrackerSyncDatapointType
) {
  const details = bg.useToggle(false);
  const { isHovering, attach } = bg.useHover();

  const isInteractive = details.on || isHovering;

  return (
    <li
      data-display="flex"
      data-direction="column"
      data-cursor={isInteractive ? "pointer" : "auto"}
      onClick={details.toggle}
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
          minHeight: "24px",
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
