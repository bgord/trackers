import { RoutableProps } from "preact-router";
import { h } from "preact";
import { useQuery } from "react-query";

import * as api from "./api";
import * as hooks from "./hooks";
import * as types from "./types";

export type InitialSettingsDataType = {
  settings: types.SettingsType;
};

export function Settings(_: RoutableProps) {
  hooks.useLeavingPrompt();

  const settings = useQuery("settings", api.Settings.get);

  console.log(settings);

  return <main>settings</main>;
}
