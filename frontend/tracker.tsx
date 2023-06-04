import * as bg from "@bgord/frontend";
import * as Icons from "iconoir-react";
import { h } from "preact";
import { useMutation, useQueryClient } from "react-query";

import * as types from "./types";
import * as api from "./api";

export function Tracker(props: types.TrackerType) {
  const t = bg.useTranslations();
  const notify = bg.useToastTrigger();
  const queryClient = useQueryClient();

  const trackerSync = useMutation(api.Tracker.sync, {
    onSuccess: () => {
      notify({ message: "tracker.value.sync.success" });
      queryClient.invalidateQueries("trackers");
    },
    onError: (error: bg.ServerError) => notify({ message: error.message }),
  });

  const trackerValue = bg.useField<types.TrackerType["value"]>(props.value);
  const isTrackerValueTheSame = props.value === trackerValue.value;

  const details = bg.useToggle();

  return (
    <li data-display="flex" data-direction="column">
      <div data-display="flex" data-cross="center" data-gap="12">
        <button
          class="c-button"
          type="button"
          data-variant="with-icon"
          title={
            details.on ? t("tracker.details.hide") : t("tracker.details.show")
          }
          onClick={details.toggle}
        >
          {details.off && <Icons.NavArrowDown height="24" width="24" />}
          {details.on && <Icons.NavArrowUp height="24" width="24" />}
        </button>

        <div class="c-badge">{t(`tracker.kind.enum.${props.kind}`)}</div>
        <div data-fs="14" data-color="gray-700">
          {props.name}
        </div>
      </div>

      {details.on && (
        <div>
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
              <label class="c-label" htmlFor="value">
                {t("tracker.value.label")}
              </label>
              <input
                id="value"
                name="value"
                class="c-input"
                type="number"
                step="0.01"
                value={trackerValue.value}
                disabled={trackerSync.isLoading}
                onChange={(event) =>
                  trackerValue.set(event.currentTarget.valueAsNumber)
                }
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
        </div>
      )}
    </li>
  );
}
