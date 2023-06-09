import * as bg from "@bgord/frontend";
import { RoutableProps } from "preact-router";
import { h } from "preact";
import { useQuery, useMutation, useQueryClient } from "react-query";

import * as api from "./api";
import * as hooks from "./hooks";
import * as types from "./types";
import * as UI from "./ui";

export type InitialSettingsDataType = {
  settings: types.SettingsType;
};

export function Settings(_: RoutableProps) {
  hooks.useLeavingPrompt();

  const t = bg.useTranslations();
  const queryClient = useQueryClient();

  const settings = useQuery("settings", api.Settings.get);

  const enableWeeklyTrackersReport = useMutation(
    api.Settings.weeklyTrackersReportEnable,
    { onSuccess: () => queryClient.invalidateQueries("settings") }
  );

  const disableWeeklyTrackersReport = useMutation(
    api.Settings.weeklyTrackersReportDisable,
    { onSuccess: () => queryClient.invalidateQueries("settings") }
  );

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

      <div data-display="flex" data-cross="center" data-gap="48">
        <div class="c-badge">
          {settings.data.isWeeklyTrackersReportEnabled
            ? t("settings.weekly_trackers_report.enabled")
            : t("settings.weekly_trackers_report.disabled")}
        </div>

        <div>{t("settings.weekly_trackers_report")}</div>

        <button
          class="c-button"
          data-variant="primary"
          data-ml="auto"
          type="button"
          onClick={() => {
            if (settings.data.isWeeklyTrackersReportEnabled) {
              disableWeeklyTrackersReport.mutate();
            } else {
              enableWeeklyTrackersReport.mutate();
            }
          }}
          disabled={
            enableWeeklyTrackersReport.isLoading ||
            disableWeeklyTrackersReport.isLoading
          }
        >
          {settings.data.isWeeklyTrackersReportEnabled
            ? t("settings.weekly_trackers_report.disable")
            : t("settings.weekly_trackers_report.enable")}
        </button>
      </div>
    </main>
  );
}
