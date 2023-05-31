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
  const trackerKind = bg.useField<types.TrackerKindEnum>(
    types.TrackerKindEnum.one_value
  );

  const trackerCreate = useMutation(api.Tracker.create, {
    onSuccess: () => {
      trackerName.clear();
      trackerKind.clear();

      notify({ message: "tracker.create.success" });
    },
    onError: (error: ServerError) => notify({ message: error.message }),
  });

  return (
    <form
      data-display="flex"
      data-gap="24"
      data-p="24"
      onSubmit={(event) => {
        event.preventDefault();
        trackerCreate.mutate({
          name: trackerName.value,
          kind: trackerKind.value,
        });
      }}
    >
      <div data-display="flex" data-direction="column">
        <label htmlFor="tracker.name" class="c-label">
          {t("tracker.name.label")}
        </label>
        <input
          class="c-input"
          id="tracker-name"
          name="tracker-name"
          onChange={(event) => trackerName.set(event.currentTarget.value)}
          pattern={`.{${TRACKER_NAME_MIN_LENGTH},${TRACKER_NAME_MAX_LENGTH}}`}
          placeholder={t("tracker.name.placeholder")}
          required
          value={trackerName.value}
          style={{ minWidth: "200px" }}
        />
      </div>

      <div data-display="flex" data-direction="column">
        <label class="c-label">{t("tracker.kind.label")}</label>
        <select
          class="c-select"
          id="tracker-kind"
          name="tracker-kind"
          onChange={(event) => trackerKind.set(event.currentTarget.value)}
          required
          value={trackerKind.value}
        >
          {Object.keys(types.TrackerKindEnum).map((option) => (
            <option value={option}>{t(`tracker.kind.enum.${option}`)}</option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        class="c-button"
        data-variant="secondary"
        data-self="end"
      >
        {t("tracker.create.submit")}
      </button>
    </form>
  );
}
