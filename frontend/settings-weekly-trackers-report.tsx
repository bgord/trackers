import * as bg from "@bgord/frontend";
import { h } from "preact";
import { useMutation, useQueryClient } from "react-query";

import * as api from "./api";
import * as hooks from "./hooks";
import * as types from "./types";
import * as UI from "./ui";

export function SettingsWeeklyTrackersReport(props: types.SettingsType) {
  hooks.useLeavingPrompt();

  const t = bg.useTranslations();
  const notify = bg.useToastTrigger();
  const queryClient = useQueryClient();

  const enableWeeklyTrackersReport = useMutation(
    api.Settings.weeklyTrackersReportEnable,
    {
      onSuccess: () => queryClient.invalidateQueries("settings"),
      onError: (error: bg.ServerError) => notify({ message: error.message }),
    }
  );

  const disableWeeklyTrackersReport = useMutation(
    api.Settings.weeklyTrackersReportDisable,
    {
      onSuccess: () => queryClient.invalidateQueries("settings"),
      onError: (error: bg.ServerError) => notify({ message: error.message }),
    }
  );

  const canToggleWeeklyTrackersReport =
    !props.email ||
    enableWeeklyTrackersReport.isLoading ||
    disableWeeklyTrackersReport.isLoading;

  return (
    <div data-display="flex" data-direction="column" data-gap="12">
      <div data-display="flex" data-cross="center" data-gap="24">
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
            disabled={canToggleWeeklyTrackersReport}
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
            disabled={canToggleWeeklyTrackersReport}
          >
            {t("settings.weekly_trackers_report.enable")}
          </button>
        )}
      </div>

      {!props.isWeeklyTrackersReportEnabled && (
        <UI.Info>{t("settings.weekly_trackers_report.info")}</UI.Info>
      )}
    </div>
  );
}
