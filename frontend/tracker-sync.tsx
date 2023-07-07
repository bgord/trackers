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
      queryClient.invalidateQueries(["goal", props.id]);
      queryClient.invalidateQueries("datapoint-list");
    },
    onError: (error: bg.ServerError) => notify({ message: error.message }),
  });

  const trackerValue = bg.useField<types.TrackerType["value"]>(
    "tracker-value",
    props.value
  );

  const trackerComment = bg.useField<string>("tracker-comment", "");

  const trackerSync = bg.useRateLimiter({
    limitMs: bg.Time.Seconds(10).toMs(),
    action: () =>
      trackerSyncMutation.mutate({
        id: props.id,
        value: trackerValue.value,
        comment: trackerComment.value,
      }),
  });

  return (
    <form
      data-display="flex"
      data-cross="start"
      data-mb="12"
      onSubmit={(event) => {
        event.preventDefault();
        trackerSync();
      }}
    >
      <div data-display="flex" data-direction="column" data-mr="12">
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

      <div data-display="flex" data-direction="column">
        <label class="c-label" {...trackerComment.label.props}>
          {t("datapoint.comment.label")}
        </label>

        <textarea
          class="c-textarea"
          rows={2}
          maxLength={types.DATAPOINT_COMMENT_MAX_LENGTH}
          placeholder={t("datapoint.comment.placeholder")}
          value={trackerComment.value}
          disabled={trackerSyncMutation.isLoading}
          onChange={(event) =>
            trackerComment.set(event.currentTarget.value as string)
          }
          style={bg.Rhythm.base().times(20).minWidth}
          {...trackerComment.input.props}
        />
      </div>

      {props.kind === types.TrackerKindEnum.counter && (
        <button
          class="c-button"
          type="button"
          data-variant="with-icon"
          data-mt="24"
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
          data-mt="24"
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
        data-mt="24"
        data-mx="12"
        disabled={trackerValue.unchanged || trackerSyncMutation.isLoading}
      >
        {t("app.sync")}
      </button>

      <UI.Clear
        data-mt="24"
        onClick={bg.exec([trackerValue.clear, trackerComment.clear])}
        disabled={
          (trackerValue.unchanged && trackerComment.unchanged) ||
          trackerSyncMutation.isLoading
        }
      />
    </form>
  );
}
