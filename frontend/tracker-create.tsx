import * as bg from "@bgord/frontend";
import { h } from "preact";
import { useMutation, useQueryClient } from "react-query";

import * as api from "./api";
import * as types from "./types";
import * as UI from "./ui";

export function TrackerCreate() {
  const t = bg.useTranslations();
  const notify = bg.useToastTrigger();
  const queryClient = useQueryClient();

  const trackerName = bg.useField<types.TrackerType["name"]>(
    "tracker-name",
    ""
  );
  const trackerKind = bg.useField<types.TrackerKindEnum>(
    "tracker-kind",
    types.TrackerKindEnum.one_value
  );

  const createTracker = useMutation(api.Tracker.create, {
    onSuccess: () => {
      trackerName.clear();
      trackerKind.clear();

      queryClient.invalidateQueries("trackers");

      notify({ message: "tracker.create.success" });
    },
    onError: (error: bg.ServerError) => notify({ message: error.message }),
  });

  return (
    <form
      data-display="flex"
      data-gap="24"
      data-md-gap="12"
      data-px="12"
      onSubmit={(event) => {
        event.preventDefault();
        createTracker.mutate({
          name: trackerName.value,
          kind: trackerKind.value,
        });
      }}
    >
      <div
        data-display="flex"
        data-direction="column"
        data-grow="1"
        style={bg.Rhythm.base().times(25).maxWidth}
      >
        <label class="c-label" {...trackerName.label.props}>
          {t("tracker.name.label")}
        </label>
        <input
          class="c-input"
          onChange={(event) => trackerName.set(event.currentTarget.value)}
          pattern={`.{${types.TRACKER_NAME_MIN_LENGTH},${types.TRACKER_NAME_MAX_LENGTH}}`}
          placeholder={t("tracker.name.placeholder")}
          required
          value={trackerName.value}
          {...trackerName.input.props}
        />
      </div>

      <div data-display="flex" data-direction="column">
        <label class="c-label" {...trackerKind.label.props}>
          {t("tracker.kind.label")}
        </label>

        <UI.Select
          onBlur={(event) =>
            trackerKind.set(event.currentTarget.value as types.TrackerKindEnum)
          }
          required
          value={trackerKind.value}
          {...trackerKind.input.props}
        >
          {Object.keys(types.TrackerKindEnum).map((option) => (
            <option value={option}>{t(`tracker.kind.enum.${option}`)}</option>
          ))}
        </UI.Select>
      </div>

      <div
        data-display="flex"
        data-wrap="nowrap"
        data-gap="24"
        data-md-gap="12"
      >
        <button
          type="submit"
          class="c-button"
          data-variant="secondary"
          data-self="end"
          disabled={trackerName.unchanged || createTracker.isLoading}
        >
          {t("tracker.create.submit")}
        </button>

        <UI.Clear
          disabled={trackerName.unchanged || createTracker.isLoading}
          data-self="end"
          onClick={trackerName.clear}
        />
      </div>
    </form>
  );
}
