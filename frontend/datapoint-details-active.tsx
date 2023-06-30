import { useQueryClient } from "react-query";

import { h } from "preact";

import * as types from "./types";
import { DatapointComment } from "./datapoint-comment";

export function DatapointActiveDetails(props: {
  id: types.DatapointType["id"] | null;
  trackerId: types.TrackerType["id"];
}) {
  const queryClient = useQueryClient();

  const datapoints = queryClient.getQueryData<types.DatapointType[]>([
    "datapoint-list",
    props.trackerId,
  ]);

  const datapoint = datapoints?.find((datapoint) => datapoint.id === props.id);

  if (!datapoint) return null;

  return (
    <div data-display="flex">
      <DatapointComment key={datapoint.comment} {...datapoint} />
    </div>
  );
}
