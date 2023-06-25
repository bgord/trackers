import * as bg from "@bgord/frontend";
import { h, Fragment } from "preact";
import { useQuery } from "react-query";

import * as types from "./types";
import * as api from "./api";
import * as UI from "./ui";

import { GoalCreate } from "./goal-create";

export function Goal(props: types.TrackerType) {
  const t = bg.useTranslations();

  const goal = useQuery(["goal", props.id], () =>
    api.Goal.getForTracker({ relatedTrackerId: props.id })
  );

  if (goal.isLoading) {
    return <UI.Info>{t("goal.loading.in_progress")}</UI.Info>;
  }

  if (goal.isError) {
    return <UI.Info>{t("goal.loading.error")}</UI.Info>;
  }

  if (
    goal.data?.result === null &&
    props.status === types.TrackerStatusEnum.active
  ) {
    return <GoalCreate {...props} />;
  }

  return (
    <div data-display="flex" data-gap="12" data-fs="14" data-main="baseline">
      {goal.data?.result?.status === types.GoalStatusEnum.awaiting && (
        <div class="c-badge">{goal.data.result.status}</div>
      )}

      {goal.data?.result?.status === types.GoalStatusEnum.accomlished && (
        <div class="c-badge" data-color="green-600" data-bg="green-100">
          {goal.data.result.status}
        </div>
      )}

      {goal.data?.result && (
        <Fragment>
          <strong data-fs="12">{t("goal")}</strong>
          <div>{t(`goal.kind.enum.${goal.data?.result?.kind}`)}</div>
          <div>{goal.data?.result?.target}</div>
        </Fragment>
      )}
    </div>
  );
}
