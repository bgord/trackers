import * as bg from "@bgord/frontend";
import { h } from "preact";
import { useMutation, useQueryClient } from "react-query";

import * as types from "./types";
import * as api from "./api";

export function TrackerSync(props: types.TrackerType) {
  const t = bg.useTranslations();
  const notify = bg.useToastTrigger();
  const queryClient = useQueryClient();

  const trackerSync = useMutation(api.Tracker.sync, {
    onSuccess: () => {
      notify({ message: "tracker.value.sync.success" });

      queryClient.invalidateQueries("trackers");
      queryClient.invalidateQueries("tracker-sync-datapoints");
    },
    onError: (error: bg.ServerError) => notify({ message: error.message }),
  });

  const trackerValue = bg.useField<types.TrackerType["value"]>(
    "tracker-value",
    props.value
  );
  const isTrackerValueTheSame = props.value === trackerValue.value;

  return (
    <form
      data-display="flex"
      data-cross="end"
      data-mt="12"
      data-gap="12"
      onSubmit={(event) => {
        event.preventDefault();
        trackerSync.mutate({ id: props.id, value: trackerValue.value });
      }}
    >
      <div data-display="flex" data-direction="column">
        <label class="c-label" {...trackerValue.label.props}>
          {t("tracker.value.label")}
        </label>

        <input
          class="c-input"
          type="number"
          step="0.01"
          value={trackerValue.value}
          disabled={trackerSync.isLoading}
          onChange={(event) =>
            trackerValue.set(
              event.currentTarget.valueAsNumber as types.TrackerType["value"]
            )
          }
          {...trackerValue.input.props}
        />
      </div>

      <button
        type="submit"
        class="c-button"
        data-variant="primary"
        disabled={isTrackerValueTheSame || trackerSync.isLoading}
      >
        {t("app.sync")}
      </button>

      <button
        type="button"
        class="c-button"
        data-variant="bare"
        disabled={isTrackerValueTheSame || trackerSync.isLoading}
        onClick={trackerValue.clear}
      >
        {t("app.clear")}
      </button>
    </form>
  );
}
