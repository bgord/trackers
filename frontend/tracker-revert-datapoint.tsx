/* eslint-disable */
import * as bg from "@bgord/frontend";
import { h } from "preact";
import { useMutation, useQueryClient } from "react-query";

import * as api from "./api";
import * as types from "./types";
import * as UI from "./ui";

export function TrackerRevertDatapoint(props: {
  id: types.TrackerDatapointType["id"];
  trackerId: types.TrackerDatapointType["id"];
}) {
  const t = bg.useTranslations();
  const notify = bg.useToastTrigger();
  const queryClient = useQueryClient();

  const trackerRevertDatapoint = useMutation(api.Tracker.revert, {
    onSuccess: () => {
      notify({ message: "tracker.datapoint.revert.success" });

      queryClient.invalidateQueries("trackers");
      queryClient.invalidateQueries([
        "tracker-datapoint-list",
        props.trackerId,
      ]);
    },
    onError: () => notify({ message: "tracker.datapoint.revert.error" }),
  });

  return (
    <UI.ClearButton
      title={t("tracker.datapoint.revert")}
      onClick={() => trackerRevertDatapoint.mutate(props)}
    />
  );
}
