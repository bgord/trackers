import * as bg from "@bgord/frontend";
import { h } from "preact";
import { useQuery } from "react-query";

import * as api from "./api";
import * as UI from "./ui";

import { Tracker } from "./tracker";

export function TrackerList() {
  const t = bg.useTranslations();

  const trackerListQuery = useQuery("trackers", api.Tracker.list);
  const trackers = trackerListQuery.data ?? [];

  if (trackerListQuery.isLoading) {
    return <UI.Info data-mx="24">{t("app.loading")}</UI.Info>;
  }

  if (trackerListQuery.isError) {
    return <UI.Info data-mx="24">{t("tracker.list.error")}</UI.Info>;
  }

  if (trackerListQuery.data?.length === 0) {
    return <UI.Info data-mx="24">{t("tracker.list.empty")}</UI.Info>;
  }

  return (
    <ul data-display="flex" data-direction="column" data-gap="24" data-m="24">
      {trackers.map((tracker) => (
        <Tracker {...tracker} />
      ))}
    </ul>
  );
}
