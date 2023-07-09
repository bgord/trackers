import * as bg from "@bgord/frontend";
import { h } from "preact";
import { useQuery } from "react-query";

import * as types from "./types";
import * as api from "./api";
import * as UI from "./ui";

import { GoalCreate } from "./goal-create";
import { GoalDelete } from "./goal-delete";

export function Goal(props: types.TrackerType) {
  const t = bg.useTranslations();

  const goal = useQuery(
    ["goal", props.id],
    () => api.Goal.getForTracker({ relatedTrackerId: props.id }),
    { retry: false }
  );

  if (goal.isLoading) {
    return (
      <UI.Info style={bg.Rhythm.base().times(5).height}>
        {t("goal.loading.in_progress")}
      </UI.Info>
    );
  }

  if (goal.isError && props.status === types.TrackerStatusEnum.active) {
    return <GoalCreate {...props} />;
  }

  if (goal.isError && props.status === types.TrackerStatusEnum.archived) {
    return null;
  }

  return (
    <div
      data-display="flex"
      data-gap="12"
      data-fs="14"
      data-cross="center"
      style={bg.Rhythm.base().times(5).height}
    >
      {goal.data?.status === types.GoalStatusEnum.awaiting && (
        <div class="c-badge">{goal.data.status}</div>
      )}

      {goal.data?.status === types.GoalStatusEnum.accomplished && (
        <div class="c-badge" data-color="green-700" data-bg="green-100">
          {goal.data.status}
        </div>
      )}

      {goal.data && (
        <div data-display="flex" data-gap="12" data-cross="center">
          <strong data-fs="12">{t("goal")}</strong>
          <div>{t(`goal.kind.enum.${goal.data?.kind}`)}</div>
          <div>{goal.data?.target}</div>

          {props.status === types.TrackerStatusEnum.active && (
            <GoalDelete {...goal.data} />
          )}
        </div>
      )}
    </div>
  );
}
