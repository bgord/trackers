/* eslint-disable */
import * as bg from "@bgord/frontend";
import { h } from "preact";
import { useQueryClient } from "react-query";

import * as types from "./types";
import { GoalVerifier } from "../modules/goals/services/goal-verifier";

import { DatapointRevert } from "./datapoint-revert";
import { ActiveDatapointIdType } from "./active-datapoint-details";

type DatapointBarPropsType = types.DatapointType & {
  status: types.TrackerType["status"];
} & { activeDatapointId: bg.UseItemReturnType<ActiveDatapointIdType> };

export function DatapointBar(props: DatapointBarPropsType) {
  const hover = bg.useHover();
  const debouncedIsHovering = bg.useDebounce<boolean>({
    value: hover.isHovering,
    delayMs: 25,
  });

  const toggleActiveDatapointKeyboardHandler = bg.useKeyHandler({
    [bg.KeyNameEnum.Enter]: props.activeDatapointId.toggle,
    [bg.KeyNameEnum.Space]: props.activeDatapointId.toggle,
  });

  const hasAccomplishedGoal = useDatapointAccomplishedGoal(props);

  const isInteractive =
    props.activeDatapointId.compare(props.id) || debouncedIsHovering;

  return (
    <li
      data-display="flex"
      data-direction="column"
      data-cursor={isInteractive ? "pointer" : "auto"}
      data-wrap="nowrap"
      tabIndex={0}
      onClick={() => props.activeDatapointId.toggle(props.id)}
      onKeyDown={toggleActiveDatapointKeyboardHandler}
      style={bg.Rhythm.base(types.DATAPOINT_BOUND_UPPER).times(1).maxHeight}
      {...hover.attach}
    >
      <div
        data-display="flex"
        data-main="center"
        data-cross="center"
        data-px="3"
        data-fs="12"
        data-bg={
          isInteractive
            ? "gray-300"
            : hasAccomplishedGoal
            ? "green-200"
            : "gray-200"
        }
        data-bwb={props.value.isMin ? "4" : undefined}
        data-bcb={props.value.isMin ? "gray-400" : undefined}
        data-bwt={props.value.isMax ? "4" : undefined}
        data-bct={props.value.isMax ? "gray-400" : undefined}
        style={{
          ...bg.Rhythm.base(props.value.scaled).times(1).height,
          ...bg.Rhythm.base(types.DATAPOINT_BOUND_LOWER).times(1).minHeight,
          ...bg.Rhythm.base().times(3).minWidth,
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
