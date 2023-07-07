import * as bg from "@bgord/frontend";
import * as Icons from "iconoir-react";
import { h, Fragment } from "preact";
import { useQueryClient, useMutation } from "react-query";

import * as api from "./api";
import * as types from "./types";

export function TrackerRestore(props: types.TrackerType) {
  const t = bg.useTranslations();

  const queryClient = useQueryClient();
  const notify = bg.useToastTrigger();

  const restoreTracker = useMutation(api.Tracker.restore, {
    onSuccess() {
      setTimeout(restoreTracker.reset, 5000);
      notify({ message: "tracker.restore.success" });
      queryClient.invalidateQueries("trackers");
    },
    onError(error: bg.ServerError) {
      setTimeout(restoreTracker.reset, 5000);
      notify({ message: error.message });
    },
  });

  return (
    <>
      <button
        type="button"
        onClick={() => restoreTracker.mutate(props)}
        disabled={!restoreTracker.isIdle}
        class="c-button"
        data-variant="with-icon"
        title={t("tracker.restore")}
      >
        <Icons.Restart height="16" width="16" />
      </button>
    </>
  );
}
