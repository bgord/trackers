import * as bg from "@bgord/frontend";
import { h } from "preact";
import { useQuery } from "react-query";

import * as UI from "./ui";
import * as types from "./types";
import * as api from "./api";

export function TrackerSyncDatapoints(props: types.TrackerType) {
  const t = bg.useTranslations();

  const trackerSyncDatapoints = useQuery(
    ["tracker-sync-datapoints", props.id],
    () => api.Tracker.getSyncDatapoints(props.id)
  );

  if (trackerSyncDatapoints.isLoading) {
    return <UI.Info>{t("app.loading")}</UI.Info>;
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
      data-mt="24"
    >
      {trackerSyncDatapoints.data.map((datapoint) => (
        <li data-display="flex" key={datapoint.id}>
          <div
            data-display="flex"
            data-main="center"
            data-cross="center"
            data-bg="gray-200"
            data-px="3"
            data-fs="12"
            data-bwb={datapoint.value.isMin ? "4" : undefined}
            data-bcb={datapoint.value.isMin ? "gray-400" : undefined}
            data-bwt={datapoint.value.isMax ? "4" : undefined}
            data-bct={datapoint.value.isMax ? "gray-400" : undefined}
            style={{
              minHeight: "24px",
              height: `${datapoint.value.scaled}px`,
              minWidth: "36px",
            }}
          >
            {datapoint.value.actual}
          </div>
        </li>
      ))}
    </ul>
  );
}
