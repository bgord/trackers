import { h } from "preact";
import { useQuery } from "react-query";

import * as api from "./api";

export function TrackerList() {
  const trackerListQuery = useQuery("trackers", api.Tracker.list);
  const trackers = trackerListQuery.data ?? [];

  if (trackerListQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (trackerListQuery.isError) {
    return <div>Error occurred</div>;
  }

  return (
    <ul>
      {trackers.map((tracker) => (
        <li data-display="flex" data-gap="6">
          <div>{tracker.kind}</div>
          <strong>{tracker.name}</strong>
        </li>
      ))}
    </ul>
  );
}
