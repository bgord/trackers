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
    return <UI.Info data-mx="24">{t("app.loading")}</UI.Info>;
  }

  if (trackerSyncDatapoints.isError) {
    return <UI.Info data-mx="24">{t("tracker.sync-datapoints.error")}</UI.Info>;
  }

  if (!trackerSyncDatapoints.data || trackerSyncDatapoints.data?.length === 0) {
    return <UI.Info data-mx="24">{t("tracker.sync-datapoints.empty")}</UI.Info>;
  }

  return (
    <ul data-display="flex" data-gap="12" data-mt="24">
      {trackerSyncDatapoints.data.map((datapoint) => (
        <li key={datapoint.id}>{datapoint.value}</li>
      ))}
    </ul>
  );
}
