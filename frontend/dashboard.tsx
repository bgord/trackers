import * as bg from "@bgord/frontend";
import { RoutableProps } from "preact-router";
import { h } from "preact";

import * as hooks from "./hooks";
import * as types from "./types";

import { TrackerCreate } from "./tracker-create";
import { TrackerList } from "./tracker-list";

export type InitialDashboardDataType = { trackers: types.TrackerType[] };

export function Dashboard(_: RoutableProps) {
  hooks.useLeavingPrompt();

  return (
    <main
      data-display="flex"
      data-direction="column"
      data-gap="12"
      data-mx="auto"
      data-my="24"
      style={bg.Rhythm.base().times(64).maxWidth}
    >
      <TrackerCreate />
      <TrackerList />
    </main>
  );
}
