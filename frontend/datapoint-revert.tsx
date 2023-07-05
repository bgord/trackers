import * as bg from "@bgord/frontend";
import { h } from "preact";
import { useMutation, useQueryClient } from "react-query";

import * as api from "./api";
import * as types from "./types";
import * as UI from "./ui";

export function DatapointRevert(props: {
  id: types.DatapointType["id"];
  trackerId: types.DatapointType["id"];
}) {
  const t = bg.useTranslations();
  const notify = bg.useToastTrigger();
  const queryClient = useQueryClient();

  const revertDatapoint = useMutation(api.Tracker.revert, {
    onSuccess: () => {
      notify({ message: "datapoint.revert.success" });

      queryClient.invalidateQueries("trackers");
      queryClient.invalidateQueries(["datapoint-list", props.trackerId]);
      queryClient.invalidateQueries(["goal", props.trackerId]);
    },
    onError: (error: bg.ServerError) => notify({ message: error.message }),
  });

  return (
    <UI.ClearButton
      disabled={revertDatapoint.isLoading}
      title={t("datapoint.revert")}
      onClick={(event) => {
        event.stopPropagation();
        revertDatapoint.mutate(props);
      }}
      style={bg.Rhythm.base().times(2).height}
    />
  );
}
