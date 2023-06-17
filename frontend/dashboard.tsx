import { RoutableProps } from "preact-router";
import { h } from "preact";

import * as hooks from "./hooks";
import * as types from "./types";

import { TrackerCreate } from "./tracker-create";
import { TrackerList } from "./tracker-list";

import { ProjectCreate } from "./project-create";
import { ProjectList } from "./project-list";

export type InitialDashboardDataType = {
  trackers: types.TrackerType[];
  projects: types.ProjectType[];
};

export function Dashboard(_: RoutableProps) {
  hooks.useLeavingPrompt();

  return (
    <main>
      <ProjectCreate />
      <ProjectList />

      <TrackerCreate />
      <TrackerList />
    </main>
  );
}
