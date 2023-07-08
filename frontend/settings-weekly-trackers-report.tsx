import * as bg from "@bgord/frontend";
import * as Icons from "iconoir-react";
import { h } from "preact";
import { useMutation, useQueryClient } from "react-query";

import * as api from "./api";
import * as hooks from "./hooks";
import * as types from "./types";
import * as UI from "./ui";

const localWeeklyTrackersReportUtcHour = bg.HourFormatter.convertUtcToLocal(
  types.WEEKLY_TRACKERS_REPORT_UTC_HOUR
).label;

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
    <div
      data-display="flex"
      data-direction="column"
      data-gap="12"
      data-md-gap="24"
    >
      <div
        data-display="flex"
        data-cross="center"
        data-gap="24"
        data-md-gap="6"
      >
        {props.isWeeklyTrackersReportEnabled && (
          <div class="c-badge" data-color="green-600" data-bg="green-100">
            {t("settings.weekly_trackers_report.enabled")}
          </div>
        )}

        {!props.isWeeklyTrackersReportEnabled && (
          <div class="c-badge">
            {t("settings.weekly_trackers_report.disabled")}
          </div>
        )}

        <div
          data-display="flex"
          data-cross="center"
          data-main="between"
          data-gap="12"
          data-grow="1"
        >
          <div data-fs="14">{t("settings.weekly_trackers_report")}</div>

          {props.isWeeklyTrackersReportEnabled && (
            <button
              class="c-button"
              data-variant="primary"
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
              type="button"
              onClick={() => enableWeeklyTrackersReport.mutate()}
              disabled={canToggleWeeklyTrackersReport}
            >
              {t("settings.weekly_trackers_report.enable")}
            </button>
          )}
        </div>
      </div>

      {!props.isWeeklyTrackersReportEnabled && (
        <UI.Info data-display="flex" data-wrap="nowrap" data-gap="12">
          <Icons.InfoEmpty height="18" width="18" style={{ flexShrink: "0" }} />

          {t("settings.weekly_trackers_report.info")}
        </UI.Info>
      )}

      {props.isWeeklyTrackersReportEnabled && (
        <UI.Info data-display="flex" data-wrap="nowrap" data-gap="12">
          <Icons.InfoEmpty height="18" width="18" style={{ flexShrink: "0" }} />

          {t("settings.weekly_trackers_report.schedule", {
            local: localWeeklyTrackersReportUtcHour,
          })}
        </UI.Info>
      )}
    </div>
  );
}
