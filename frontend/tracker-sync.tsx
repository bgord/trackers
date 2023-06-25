import * as bg from "@bgord/frontend";
import * as Icons from "iconoir-react";
import { h } from "preact";
import { useMutation, useQueryClient } from "react-query";

import * as types from "./types";
import * as api from "./api";
import * as UI from "./ui";

export function TrackerSync(props: types.TrackerType) {
  const t = bg.useTranslations();
  const notify = bg.useToastTrigger();
  const queryClient = useQueryClient();

  const trackerSyncMutation = useMutation(api.Tracker.sync, {
    onSuccess: () => {
      notify({ message: "tracker.sync.success" });

      queryClient.invalidateQueries("trackers");
      queryClient.invalidateQueries("tracker-datapoint-list");
    },
    onError: (error: bg.ServerError) => notify({ message: error.message }),
  });

  const trackerValue = bg.useField<types.TrackerType["value"]>(
    "tracker-value",
    props.value
  );

  const trackerSync = bg.useRateLimiter({
    limitMs: bg.Time.Seconds(10).toMs(),
    action: () =>
      trackerSyncMutation.mutate({ id: props.id, value: trackerValue.value }),
  });

  const isTrackerValueTheSame = props.value === trackerValue.value;

  return (
    <form
      data-display="flex"
      data-cross="end"
      onSubmit={(event) => {
        event.preventDefault();
        trackerSync();
      }}
    >
      <div data-display="flex" data-direction="column">
        <label class="c-label" {...trackerValue.label.props}>
          {t("tracker.value.label")}
        </label>

        <input
          class="c-input"
          type="number"
          step={props.kind === types.TrackerKindEnum.counter ? "1" : "0.01"}
          value={trackerValue.value}
          disabled={trackerSyncMutation.isLoading}
          onChange={(event) =>
            trackerValue.set(
              event.currentTarget.valueAsNumber as types.TrackerType["value"]
            )
          }
          {...trackerValue.input.props}
        />
      </div>

      {props.kind === types.TrackerKindEnum.counter && (
        <button
          class="c-button"
          type="button"
          data-variant="with-icon"
          title={t("tracker.value.increase")}
          onClick={() => trackerValue.set(trackerValue.value + 1)}
          disabled={trackerSyncMutation.isLoading}
        >
          <Icons.Plus height="20" width="20" />
        </button>
      )}

      {props.kind === types.TrackerKindEnum.counter && (
        <button
          class="c-button"
          type="button"
          data-variant="with-icon"
          title={t("tracker.value.decrease")}
          onClick={() => trackerValue.set(trackerValue.value - 1)}
          disabled={trackerSyncMutation.isLoading}
        >
          <Icons.Minus height="20" width="20" />
        </button>
      )}

      <button
        type="submit"
        class="c-button"
        data-variant="primary"
        data-mx="12"
        disabled={isTrackerValueTheSame || trackerSyncMutation.isLoading}
      >
        {t("app.sync")}
      </button>

      <UI.ClearButton
        onClick={trackerValue.clear}
        disabled={isTrackerValueTheSame || trackerSyncMutation.isLoading}
      />
    </form>
  );
}
