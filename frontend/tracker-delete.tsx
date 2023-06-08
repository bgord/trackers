import * as bg from "@bgord/frontend";
import { h, Fragment } from "preact";
import { useQueryClient, useMutation } from "react-query";

import * as api from "./api";
import * as types from "./types";

export function TrackerDelete(
  props: types.TrackerType & h.JSX.IntrinsicElements["button"]
) {
  const { id, ...rest } = props;

  const t = bg.useTranslations();

  const queryClient = useQueryClient();
  const notify = bg.useToastTrigger();
  const dialog = bg.useToggle();

  const deleteTracker = useMutation(api.Tracker.delete, {
    onSuccess() {
      dialog.disable();
      notify({ message: "tracker.delete.success" });
      queryClient.invalidateQueries("trackers");
    },
    onError() {
      setTimeout(deleteTracker.reset, 5000);
      notify({ message: "tracker.delete.error" });
    },
  });

  return (
    <>
      <button
        type="button"
        onClick={dialog.enable}
        disabled={deleteTracker.isLoading || deleteTracker.isSuccess}
        class="c-button"
        data-variant="bare"
        {...rest}
      >
        {deleteTracker.isIdle && t("tracker.delete")}
        {deleteTracker.isLoading && t("tracker.delete.in_progress")}
        {deleteTracker.isSuccess && t("tracker.delete.success")}
        {deleteTracker.isError && t("tracker.delete.error")}
      </button>

      <bg.Dialog {...dialog} data-gap="24" data-mt="72">
        <div>{t("tracker.delete.confirmation")}</div>

        <div data-display="flex" data-gap="48" data-mx="auto">
          <button
            type="button"
            class="c-button"
            data-variant="primary"
            onClick={() => deleteTracker.mutate({ id })}
          >
            {t("app.delete")}
          </button>

          <button
            type="button"
            class="c-button"
            data-variant="bare"
            onClick={dialog.disable}
          >
            {t("app.cancel")}
          </button>
        </div>
      </bg.Dialog>
    </>
  );
}
