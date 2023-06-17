import * as bg from "@bgord/frontend";
import { useMutation, useQueryClient } from "react-query";
import { h } from "preact";

import { TRACKER_NAME_MIN_LENGTH } from "../modules/trackers/value-objects/tracker-name-min-length";
import { TRACKER_NAME_MAX_LENGTH } from "../modules/trackers/value-objects/tracker-name-max-length";

import * as UI from "./ui";
import * as types from "./types";
import * as api from "./api";

export function TrackerNameChange(props: types.TrackerType) {
  const t = bg.useTranslations();
  const notify = bg.useToastTrigger();
  const queryClient = useQueryClient();

  const newTrackerName = bg.useField("new-tracker-name", props.name);

  const changeName = useMutation(api.Tracker.changeName, {
    onSuccess: () => {
      notify({ message: "tracker.name.new.change.success" });

      queryClient.invalidateQueries("trackers");
    },
    onError: (error: bg.ServerError) => notify({ message: error.message }),
  });

  const isTrackerNameChanged = props.name === newTrackerName.value;

  return (
    <form
      data-display="flex"
      data-gap="12"
      onSubmit={(event) => {
        event.preventDefault();
        changeName.mutate({ id: props.id, name: newTrackerName.value });
      }}
    >
      <div data-display="flex" data-direction="column">
        <label class="c-label" {...newTrackerName.label.props}>
          {t("tracker.name.new.label")}
        </label>
        <input
          class="c-input"
          onChange={(event) => newTrackerName.set(event.currentTarget.value)}
          pattern={`.{${TRACKER_NAME_MIN_LENGTH},${TRACKER_NAME_MAX_LENGTH}}`}
          placeholder={t("tracker.name.placeholder")}
          required
          style={{ minWidth: "200px" }}
          value={newTrackerName.value}
          {...newTrackerName.input.props}
        />
      </div>

      <button
        type="submit"
        class="c-button"
        data-variant="secondary"
        data-self="end"
        disabled={isTrackerNameChanged}
      >
        {t("tracker.name.new.change")}
      </button>

      <UI.ClearButton
        onClick={newTrackerName.clear}
        data-self="end"
        disabled={isTrackerNameChanged}
      />
    </form>
  );
}
