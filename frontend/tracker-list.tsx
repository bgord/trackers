import * as bg from "@bgord/frontend";
import { h, Fragment } from "preact";
import { useQuery } from "react-query";

import * as api from "./api";
import * as UI from "./ui";

import { Tracker } from "./tracker";

export function TrackerList() {
  const t = bg.useTranslations();
  const pluralize = bg.usePluralize();

  const trackerListQuery = useQuery("trackers", api.Tracker.list, {
    refetchOnMount: true,
  });
  const trackers = trackerListQuery.data ?? [];

  if (trackerListQuery.isLoading) {
    return <UI.Info data-mx="auto">{t("app.loading")}</UI.Info>;
  }

  if (trackerListQuery.isError) {
    return <UI.Info data-mx="auto">{t("tracker.list.error")}</UI.Info>;
  }

  if (trackerListQuery.data?.length === 0) {
    return <UI.Info data-mx="auto">{t("tracker.list.empty")}</UI.Info>;
  }

  return (
    <Fragment>
      <UI.Info data-color="gray-500" data-ml="12" data-mt="24">
        {t("tracker.list.count", {
          value: trackers.length,
          noun: pluralize({ value: trackers.length, singular: t("tracker") }),
        })}
      </UI.Info>

      <ul
        data-display="flex"
        data-direction="column"
        data-gap="12"
        data-max-width="100%"
      >
        {trackers.map((tracker) => (
          <Tracker key={tracker.updatedAt} {...tracker} />
        ))}
      </ul>
    </Fragment>
  );
}
