import * as bg from "@bgord/frontend";
import { useMutation } from "react-query";
import { h } from "preact";

import * as UI from "./ui";
import * as types from "./types";
import * as api from "./api";

export function GoalCreate(props: types.TrackerType) {
  const t = bg.useTranslations();
  const notify = bg.useToastTrigger();

  const target = bg.useField<types.GoalType["target"]>(
    "goal-target",
    0 as types.GoalType["target"]
  );

  const kind = bg.useField<types.GoalKindEnum>(
    "goal-kind",
    types.GoalKindEnum.minimum
  );

  const createGoal = useMutation(api.Goal.create, {
    onSuccess: () => {
      notify({ message: "goal.create.success" });
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
          target: target.value as types.GoalType["target"],
          relatedTrackerId: props.id,
          kind: kind.value,
        });
      }}
    >
      <div data-display="flex" data-direction="column">
        <label class="c-label" {...kind.label.props}>
          {t("goal.kind.label")}
        </label>
        <UI.Select
          onBlur={(event) => kind.set(event.currentTarget.value)}
          required
          value={kind.value}
          {...kind.input.props}
        >
          {Object.keys(types.GoalKindEnum).map((option) => (
            <option value={option}>{t(`goal.kind.enum.${option}`)}</option>
          ))}
        </UI.Select>
      </div>

      <div data-display="flex" data-direction="column">
        <label class="c-label" {...target.label.props}>
          {t("goal.target.label")}
        </label>

        <input
          class="c-input"
          type="number"
          step={props.kind === types.TrackerKindEnum.counter ? "1" : "0.01"}
          value={target.value}
          onChange={(event) =>
            target.set(
              event.currentTarget.valueAsNumber as types.GoalType["target"]
            )
          }
          {...target.input.props}
        />
      </div>

      <button
        type="submit"
        class="c-button"
        data-variant="secondary"
        data-self="end"
      >
        {t("goal.create")}
      </button>

      <UI.ClearButton
        onClick={() => {
          target.clear();
          kind.clear();
        }}
        data-self="end"
      />
    </form>
  );
}
