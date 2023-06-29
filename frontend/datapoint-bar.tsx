/* eslint-disable */
import * as bg from "@bgord/frontend";
import { h } from "preact";
import { useQueryClient } from "react-query";

import * as types from "./types";
import { GoalVerifier } from "../modules/goals/services/goal-verifier";

import { DatapointRevert } from "./datapoint-revert";

type DatapointBarPropsType = types.DatapointType & {
  status: types.TrackerType["status"];
};

export function DatapointBar(props: DatapointBarPropsType) {
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

  const hasAccomplishedGoal = useDatapointAccomplishedGoal(props);

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
      style={{ maxHeight: `${types.DATAPOINT_BOUND_UPPER}px` }}
      {...hover.attach}
    >
      <div
        data-display="flex"
        data-main="center"
        data-cross="center"
        data-bg={
          isActive ? "gray-300" : hasAccomplishedGoal ? "green-200" : "gray-200"
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

      {isActive && (
        <div data-fs="12" title={bg.DateFormatter.datetime(props.createdAt)}>
          {bg.DateFormatter.monthDay(props.createdAt)}
        </div>
      )}

      {isActive && props.status === types.TrackerStatusEnum.active && (
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
