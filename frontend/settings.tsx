import * as bg from "@bgord/frontend";
import { RoutableProps } from "preact-router";
import { h } from "preact";
import { useQuery } from "react-query";

import * as api from "./api";
import * as hooks from "./hooks";
import * as types from "./types";
import * as UI from "./ui";

import { SettingsWeeklyTrackersReport } from "./settings-weekly-trackers-report";
import { SettingsEmail } from "./settings-email";

export type InitialSettingsDataType = {
  settings: types.SettingsType;
};

export function Settings(_: RoutableProps) {
  hooks.useLeavingPrompt();

  const t = bg.useTranslations();

  const settings = useQuery("settings", api.Settings.get);

  if (settings.isError) {
    return <UI.Info data-m="24">{t("settings.error")}</UI.Info>;
  }

  if (!settings.isSuccess) {
    return <UI.Info data-m="24">{t("settings.loading")}</UI.Info>;
  }

  return (
    <main
      data-display="flex"
      data-direction="column"
      data-gap="48"
      data-p="24"
      data-max-width="768"
      data-mx="auto"
    >
      <header data-fs="20">{t("app.settings")}</header>
      <SettingsWeeklyTrackersReport {...settings.data} />
      <SettingsEmail {...settings.data} />
    </main>
  );
}
