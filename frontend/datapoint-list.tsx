import * as bg from "@bgord/frontend";
import { h, Fragment } from "preact";
import { useQuery } from "react-query";

import * as UI from "./ui";
import * as types from "./types";
import * as api from "./api";

import { DatapointBar } from "./datapoint-bar";
import { DatapointsChartPlaceholder } from "./datapoints-bar-placeholder";
import {
  ActiveDatapointDetails,
  ActiveDatapointIdType,
} from "./active-datapoint-details";

export function DatapointList(props: types.TrackerType) {
  const t = bg.useTranslations();

  const datapoints = useQuery(["datapoint-list", props.id], () =>
    api.Tracker.getDatapoints(props.id)
  );
  const activeDatapointId = bg.useItem<ActiveDatapointIdType>();

  if (datapoints.isLoading) {
    return <DatapointsChartPlaceholder bars={10} />;
  }

  if (datapoints.isError) {
    return <UI.Info>{t("datapoints.error")}</UI.Info>;
  }

  if (!datapoints.data || datapoints.data?.length === 0) {
    return <UI.Info data-my="24">{t("datapoints.empty")}</UI.Info>;
  }

  return (
    <Fragment>
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
        style={{ minHeight: `${types.DATAPOINT_BOUND_UPPER + 8}px` }}
      >
        {datapoints.data.map((datapoint) => (
          <DatapointBar
            key={datapoint.id}
            status={props.status}
            activeDatapointId={activeDatapointId}
            {...datapoint}
          />
        ))}
      </ul>

      <ActiveDatapointDetails
        id={activeDatapointId.value}
        trackerId={props.id}
      />
    </Fragment>
  );
}
