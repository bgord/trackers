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

  const trackerSyncDatapoints = useQuery(
    ["tracker-datapoint-list", props.id],
    () => api.Tracker.getSyncDatapoints(props.id)
  );

  if (trackerSyncDatapoints.isLoading) {
    return <TrackerDatapointsChartPlaceholder bars={15} />;
  }

  if (trackerSyncDatapoints.isError) {
    return <UI.Info>{t("tracker.sync-datapoints.error")}</UI.Info>;
  }

  if (!trackerSyncDatapoints.data || trackerSyncDatapoints.data?.length === 0) {
    return <UI.Info>{t("tracker.sync-datapoints.empty")}</UI.Info>;
  }

  return (
    <ul
      data-display="flex"
      data-cross="end"
      data-wrap="nowrap"
      data-max-width="100%"
      data-overflow="scroll"
      data-gap="3"
    >
      {trackerSyncDatapoints.data.map((datapoint) => (
        <TrackerDatapointBar key={datapoint.id} {...datapoint} />
      ))}
    </ul>
  );
}
