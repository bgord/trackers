/* eslint-disable */
import * as bg from "@bgord/frontend";
import { h } from "preact";
import { useQueryClient } from "react-query";

import * as types from "./types";
import { GoalVerifier } from "../modules/goals/services/goal-verifier";

import { DatapointRevert } from "./datapoint-revert";

type DatapointBarPropsType = types.DatapointType & {
  status: types.TrackerType["status"];
} & {
  activeDatapointId: bg.UseFieldReturnType<types.DatapointType["id"] | null>;
};

export function DatapointBar(props: DatapointBarPropsType) {
  const hover = bg.useHover();
  const debouncedIsHovering = bg.useDebounce<boolean>({
    value: hover.isHovering,
    delayMs: 25,
  });

  function toggleActiveDatapoint() {
    isActive
      ? props.activeDatapointId.clear()
      : props.activeDatapointId.set(props.id);
  }

  const toggleActiveDatapointKeyboardHandler = bg.useKeyHandler({
    [bg.KeyNameEnum.Enter]: toggleActiveDatapoint,
    [bg.KeyNameEnum.Space]: toggleActiveDatapoint,
  });

  const hasAccomplishedGoal = useDatapointAccomplishedGoal(props);

  const isActive = props.activeDatapointId.value === props.id;
  const isInteractive = isActive || debouncedIsHovering;

  return (
    <li
      data-display="flex"
      data-direction="column"
      data-cursor={isInteractive ? "pointer" : "auto"}
      data-wrap="nowrap"
      tabIndex={0}
      onClick={toggleActiveDatapoint}
      onKeyDown={toggleActiveDatapointKeyboardHandler}
      style={{ maxHeight: `${types.DATAPOINT_BOUND_UPPER}px` }}
      {...hover.attach}
    >
      <div
        data-display="flex"
        data-main="center"
        data-cross="center"
        data-bg={
          isInteractive
            ? "gray-300"
            : hasAccomplishedGoal
            ? "green-200"
            : "gray-200"
        }
        data-px="3"
        data-fs="12"
        data-bwb={props.value.isMin ? "4" : undefined}
        data-bcb={props.value.isMin ? "gray-400" : undefined}
        data-bwt={props.value.isMax ? "4" : undefined}
        data-bct={props.value.isMax ? "gray-400" : undefined}
        style={{
          minHeight: `${types.DATAPOINT_BOUND_LOWER}px`,
          height: `${props.value.scaled}px`,
          minWidth: "36px",
        }}
      >
        {props.value.actual}
      </div>

      {isInteractive && (
        <div data-fs="12" title={bg.DateFormatter.datetime(props.createdAt)}>
          {bg.DateFormatter.monthDay(props.createdAt)}
        </div>
      )}

      {isInteractive && props.status === types.TrackerStatusEnum.active && (
        <DatapointRevert {...props} />
      )}
    </li>
  );
}

function useDatapointAccomplishedGoal(props: DatapointBarPropsType): boolean {
  const queryClient = useQueryClient();

  const goal = queryClient.getQueryData(["goal", props.trackerId]) as
    | types.GoalType
    | undefined;

  if (!goal) return false;

  const goalVerifier = new GoalVerifier(goal);

  return goalVerifier.verify(props.value.actual as types.TrackerType["value"]);
}
