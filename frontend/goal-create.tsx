import * as bg from "@bgord/frontend";
import { useMutation, useQueryClient } from "react-query";
import { h } from "preact";

import * as UI from "./ui";
import * as types from "./types";
import * as api from "./api";

export function GoalCreate(props: types.TrackerType) {
  const t = bg.useTranslations();
  const notify = bg.useToastTrigger();
  const queryClient = useQueryClient();

  const goalTarget = bg.useField<types.GoalType["target"]>(
    "goal-target",
    0 as types.GoalType["target"]
  );

  const goalKind = bg.useField<types.GoalKindEnum>(
    "goal-kind",
    types.GoalKindEnum.minimum
  );

  const createGoal = useMutation(api.Goal.create, {
    onSuccess: () => {
      notify({ message: "goal.create.success" });
      queryClient.invalidateQueries(["goal", props.id]);
    },
    onError: (error: bg.ServerError) => notify({ message: error.message }),
  });

  return (
    <form
      data-display="flex"
      data-gap="12"
      onSubmit={(event) => {
        event.preventDefault();

        createGoal.mutate({
          target: goalTarget.value as types.GoalType["target"],
          relatedTrackerId: props.id,
          kind: goalKind.value,
        });
      }}
    >
      <div data-display="flex" data-direction="column">
        <label class="c-label" {...goalKind.label.props}>
          {t("goal.kind.label")}
        </label>

        <UI.Select
          onBlur={(event) => goalKind.set(event.currentTarget.value)}
          required
          value={goalKind.value}
          {...goalKind.input.props}
        >
          {Object.keys(types.GoalKindEnum).map((option) => (
            <option value={option}>{t(`goal.kind.enum.${option}`)}</option>
          ))}
        </UI.Select>
      </div>

      <div data-display="flex" data-direction="column">
        <label class="c-label" {...goalTarget.label.props}>
          {t("goal.target.label")}
        </label>

        <input
          class="c-input"
          type="number"
          step={props.kind === types.TrackerKindEnum.counter ? "1" : "0.01"}
          value={goalTarget.value}
          onChange={(event) =>
            goalTarget.set(
              event.currentTarget.valueAsNumber as types.GoalType["target"]
            )
          }
          {...goalTarget.input.props}
        />
      </div>

      <button
        type="submit"
        class="c-button"
        data-variant="secondary"
        data-self="end"
        disabled={goalTarget.unchanged || createGoal.isLoading}
      >
        {t("goal.create")}
      </button>

      <UI.ClearButton
        onClick={bg.exec([goalTarget.clear, goalKind.clear])}
        disabled={
          (goalTarget.unchanged && goalKind.unchanged) || createGoal.isLoading
        }
        data-self="end"
      />
    </form>
  );
}
