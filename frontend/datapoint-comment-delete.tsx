import * as bg from "@bgord/frontend";
import { h } from "preact";
import * as Icons from "iconoir-react";
import { useQueryClient, useMutation } from "react-query";

import * as types from "./types";
import * as api from "./api";

export function DatapointCommentDelete(props: types.DatapointType) {
  const t = bg.useTranslations();
  const notify = bg.useToastTrigger();
  const queryClient = useQueryClient();

  const datapointCommentDelete = useMutation(api.Tracker.deleteComment, {
    onSuccess() {
      notify({ message: "datapoint.comment.delete.success" });
      queryClient.invalidateQueries(["datapoint-list", props.trackerId]);
    },
    onError() {
      setTimeout(datapointCommentDelete.reset, 5000);
      notify({ message: "datapoint.comment.delete.error" });
    },
  });

  return (
    <button
      type="button"
      class="c-button"
      data-variant="with-icon"
      data-color="red-600"
      title={t("datapoint.comment.delete")}
      data-ml="auto"
      disabled={datapointCommentDelete.isLoading}
      onClick={() => datapointCommentDelete.mutate({ id: props.id })}
    >
      <Icons.RemoveSquare height="24" width="24" />
    </button>
  );
}
