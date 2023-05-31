import { RoutableProps } from "preact-router";
import { h } from "preact";

import * as hooks from "./hooks";
import * as types from "./types";

import { TrackerCreate } from "./tracker-create";
import { TrackerList } from "./tracker-list";

export type InitialDashboardDataType = {
  trackers: types.TrackerType[];
};

export function Dashboard(_: RoutableProps) {
  hooks.useLeavingPrompt();

  return (
    <main>
      <TrackerCreate />
      <TrackerList />
    </main>
  );
}
