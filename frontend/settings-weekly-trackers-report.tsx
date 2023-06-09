import * as bg from "@bgord/frontend";
import { h } from "preact";
import { useMutation, useQueryClient } from "react-query";

import * as api from "./api";
import * as hooks from "./hooks";
import * as types from "./types";

export function SettingsWeeklyTrackersReport(props: types.SettingsType) {
  hooks.useLeavingPrompt();

  const t = bg.useTranslations();
  const queryClient = useQueryClient();

  const enableWeeklyTrackersReport = useMutation(
    api.Settings.weeklyTrackersReportEnable,
    { onSuccess: () => queryClient.invalidateQueries("settings") }
  );

  const disableWeeklyTrackersReport = useMutation(
    api.Settings.weeklyTrackersReportDisable,
    { onSuccess: () => queryClient.invalidateQueries("settings") }
  );

  const isChangeDisabled =
    enableWeeklyTrackersReport.isLoading ||
    disableWeeklyTrackersReport.isLoading;

  return (
    <div data-display="flex" data-cross="center" data-gap="48">
      {props.isWeeklyTrackersReportEnabled && (
        <div class="c-badge">
          {t("settings.weekly_trackers_report.enabled")}
        </div>
      )}

      {!props.isWeeklyTrackersReportEnabled && (
        <div class="c-badge">
          {t("settings.weekly_trackers_report.disabled")}
        </div>
      )}

      <div>{t("settings.weekly_trackers_report")}</div>

      {props.isWeeklyTrackersReportEnabled && (
        <button
          class="c-button"
          data-variant="primary"
          data-ml="auto"
          type="button"
          onClick={() => disableWeeklyTrackersReport.mutate()}
          disabled={isChangeDisabled}
        >
          {t("settings.weekly_trackers_report.disable")}
        </button>
      )}

      {!props.isWeeklyTrackersReportEnabled && (
        <button
          class="c-button"
          data-variant="primary"
          data-ml="auto"
          type="button"
          onClick={() => enableWeeklyTrackersReport.mutate()}
          disabled={isChangeDisabled}
        >
          {t("settings.weekly_trackers_report.enable")}
        </button>
      )}
    </div>
  );
}
