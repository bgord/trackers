import * as bg from "@bgord/frontend";
import { h } from "preact";
import { useMutation } from "react-query";

import * as api from "./api";
import * as types from "./types";
import { TRACKER_NAME_MIN_LENGTH } from "../value-objects/tracker-name-min-length";
import { TRACKER_NAME_MAX_LENGTH } from "../value-objects/tracker-name-max-length";
import { ServerError } from "./server-error";

export function TrackerCreate() {
  const t = bg.useTranslations();
  const notify = bg.useToastTrigger();

  const trackerName = bg.useField<types.TrackerNameType>("");
  const trackerCreate = useMutation(api.Tracker.create, {
    onSuccess: () => {
      trackerName.clear();
      notify({ message: "tracker.create.success" });
    },
    onError: (error: ServerError) => notify({ message: error.message }),
  });

  return (
    <form
      data-p="24"
      style={{ maxWidth: "350px" }}
      onSubmit={(event) => {
        event.preventDefault();
        trackerCreate.mutate({
          name: trackerName.value,
        });
      }}
    >
      <div data-display="flex" data-direction="column">
        <label class="c-label">{t("tracker.name.label")}</label>
        <input
          value={trackerName.value}
          onChange={(event) => trackerName.set(event.currentTarget.value)}
          class="c-input"
          placeholder={t("tracker.name.placeholder")}
          pattern={`.{${TRACKER_NAME_MIN_LENGTH},${TRACKER_NAME_MAX_LENGTH}}`}
        />
      </div>

      <button
        type="submit"
        class="c-button"
        data-variant="secondary"
        data-mt="24"
      >
        {t("tracker.create.submit")}
      </button>
    </form>
  );
}
