import * as bg from "@bgord/frontend";
import { h } from "preact";
import { useQueryClient, useMutation } from "react-query";

import * as types from "./types";
import * as api from "./api";

import { DatapointCommentDelete } from "./datapoint-comment-delete";

export function DatapointComment(props: types.DatapointType) {
  const t = bg.useTranslations();
  const notify = bg.useToastTrigger();
  const queryClient = useQueryClient();

  const trackerComment = bg.useField<types.DatapointType["comment"] | null>(
    "datapoint-comment",
    props.comment
  );

  const updateDatapointComment = useMutation(api.Tracker.updateComment, {
    onSuccess: () => {
      notify({ message: "datapoint.comment.update.success" });
      queryClient.invalidateQueries(["datapoint-list", props.trackerId]);
    },
    onError() {
      setTimeout(updateDatapointComment.reset, 5000);
      notify({ message: "datapoint.comment.update.error" });
    },
  });

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
          disabled={
            trackerComment.unchanged || updateDatapointComment.isLoading
          }
          onClick={() =>
            updateDatapointComment.mutate({
              id: props.id,
              comment: trackerComment.value,
            })
          }
        >
          {t("datapoint.comment.update")}
        </button>

        <button
          type="button"
          class="c-button"
          data-variant="bare"
          disabled={
            trackerComment.unchanged || updateDatapointComment.isLoading
          }
          onClick={trackerComment.clear}
        >
          {t("app.cancel")}
        </button>

        {trackerComment.value && props.comment && (
          <DatapointCommentDelete {...props} />
        )}
      </div>
    </div>
  );
}
