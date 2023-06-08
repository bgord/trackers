/* eslint-disable */
import * as bg from "@bgord/frontend";
import * as Icons from "iconoir-react";
import { h } from "preact";
import { useMutation, useQueryClient } from "react-query";

import * as api from "./api";
import * as types from "./types";

export function TrackerRevertDatapoint(props: {
  id: types.TrackerSyncDatapointType["id"];
  trackerId: types.TrackerSyncDatapointType["id"];
}) {
  const t = bg.useTranslations();
  const notify = bg.useToastTrigger();
  const queryClient = useQueryClient();

  const trackerRevertDatapoint = useMutation(api.Tracker.revert, {
    onSuccess: () => {
      notify({ message: "tracker.sync-datapoint.revert.success" });

      queryClient.invalidateQueries("trackers");
      queryClient.invalidateQueries([
        "tracker-sync-datapoints",
        props.trackerId,
      ]);
    },
    onError: () => notify({ message: "tracker.sync-datapoint.revert.error" }),
  });

  return (
    <button
      class="c-button"
      data-variant="with-icon"
      title={t("tracker.sync-datapoint.revert")}
      onClick={() => trackerRevertDatapoint.mutate(props)}
    >
      <Icons.Cancel height="16" width="16" />
    </button>
  );
}
