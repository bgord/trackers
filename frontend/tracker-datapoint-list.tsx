import * as bg from "@bgord/frontend";
import { h } from "preact";
import { useQuery } from "react-query";

import * as UI from "./ui";
import * as types from "./types";
import * as api from "./api";

import { TrackerDatapointBar } from "./tracker-datapoint-bar";
import { TrackerDatapointsChartPlaceholder } from "./tracker-datapoints-bar-placeholder";

export function TrackerDatapointList(props: types.TrackerType) {
  const t = bg.useTranslations();

  const trackerDatapoints = useQuery(["tracker-datapoint-list", props.id], () =>
    api.Tracker.getDatapoints(props.id)
  );

  if (trackerDatapoints.isLoading) {
    return <TrackerDatapointsChartPlaceholder bars={15} />;
  }

  if (trackerDatapoints.isError) {
    return <UI.Info>{t("tracker.datapoints.error")}</UI.Info>;
  }

  if (!trackerDatapoints.data || trackerDatapoints.data?.length === 0) {
    return <UI.Info>{t("tracker.datapoints.empty")}</UI.Info>;
  }

  return (
    <ul
      data-display="flex"
      data-cross="end"
      data-wrap="nowrap"
      data-gap="3"
      data-py="3"
      data-max-width="100%"
      data-bwy="1"
      data-bcy="gray-200"
      data-overflow="scroll"
      style={{ minHeight: `${types.TRACKER_DATAPOINT_BOUND_UPPER}px` }}
    >
      {trackerDatapoints.data.map((datapoint) => (
        <TrackerDatapointBar
          key={datapoint.id}
          status={props.status}
          {...datapoint}
        />
      ))}
    </ul>
  );
}
