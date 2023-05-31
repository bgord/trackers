import * as bg from "@bgord/frontend";
import { h } from "preact";
import { useQuery } from "react-query";

import * as api from "./api";

export function TrackerList() {
  const t = bg.useTranslations();

  const trackerListQuery = useQuery("trackers", api.Tracker.list);
  const trackers = trackerListQuery.data ?? [];

  if (trackerListQuery.isLoading) {
    return <div data-mx="24">Loading...</div>;
  }

  if (trackerListQuery.isError) {
    return <div data-mx="24">Error occurred</div>;
  }

  return (
    <ul data-display="flex" data-direction="column" data-gap="24" data-m="24">
      {trackers.map((tracker) => (
        <li data-display="flex" data-gap="12">
          <div class="c-badge">{t(`tracker.kind.enum.${tracker.kind}`)}</div>
          <strong>{tracker.name}</strong>
        </li>
      ))}
    </ul>
  );
}
