import * as bg from "@bgord/frontend";
import { h } from "preact";
import * as Icons from "iconoir-react";

import * as types from "./types";

export function DatapointComment(props: types.DatapointType) {
  const t = bg.useTranslations();

  const trackerComment = bg.useField<types.DatapointType["comment"] | null>(
    "datapoint-comment",
    props.comment
  );

  return (
    <div
      data-display="flex"
      data-direction="column"
      data-cross="start"
      data-gap="12"
    >
      <div data-display="flex" data-direction="column">
        <label class="c-label" {...trackerComment.label.props}>
          {t("datapoint.comment.label")}
        </label>

        <textarea
          class="c-textarea"
          rows={3}
          maxLength={types.DATAPOINT_COMMENT_MAX_LENGTH}
          placeholder={t("datapoint.comment.placeholder")}
          value={trackerComment.value ?? ""}
          onChange={(event) =>
            trackerComment.set(event.currentTarget.value as string)
          }
          style={bg.Rhythm.base().times(20).minWidth}
          {...trackerComment.input.props}
        />
      </div>

      <div data-display="flex" data-gap="12" data-width="100%">
        <button
          type="button"
          class="c-button"
          data-variant="primary"
          disabled={trackerComment.unchanged}
        >
          {t("datapoint.comment.update")}
        </button>

        <button
          type="button"
          class="c-button"
          data-variant="bare"
          disabled={trackerComment.unchanged}
          onClick={trackerComment.clear}
        >
          {t("app.cancel")}
        </button>

        <button
          type="button"
          class="c-button"
          data-variant="with-icon"
          data-color="red-600"
          title={t("datapoint.comment.delete")}
          data-ml="auto"
        >
          <Icons.RemoveSquare height="24" width="24" />
        </button>
      </div>
    </div>
  );
}
