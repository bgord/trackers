import * as bg from "@bgord/frontend";
import * as Icons from "iconoir-react";
import { h, Fragment } from "preact";
import { useQueryClient, useMutation } from "react-query";

import * as api from "./api";
import * as types from "./types";

export function TrackerArchive(
  props: types.TrackerType & h.JSX.IntrinsicElements["button"]
) {
  const { id, ...rest } = props;

  const t = bg.useTranslations();

  const queryClient = useQueryClient();
  const notify = bg.useToastTrigger();
  const dialog = bg.useToggle();

  const archiveTracker = useMutation(api.Tracker.archive, {
    onSuccess() {
      setTimeout(archiveTracker.reset, 5000);
      dialog.disable();
      notify({ message: "tracker.archive.success" });
      queryClient.invalidateQueries("trackers");
    },
    onError() {
      setTimeout(archiveTracker.reset, 5000);
      notify({ message: "tracker.archive.error" });
      dialog.disable();
    },
  });

  return (
    <>
      <button
        type="button"
        onClick={dialog.enable}
        disabled={archiveTracker.isLoading || archiveTracker.isSuccess}
        class="c-button"
        data-variant="bare"
        title={t("tracker.archive")}
        {...rest}
      >
        {archiveTracker.isIdle && <Icons.Archive height="20" width="20" />}
        {archiveTracker.isLoading && t("tracker.archive.in_progress")}
        {archiveTracker.isSuccess && t("tracker.archive.success")}
        {archiveTracker.isError && t("tracker.archive.error")}
      </button>

      <bg.Dialog {...dialog} data-gap="24" data-mt="72">
        <div>{t("tracker.archive.confirmation")}</div>

        <div data-display="flex" data-gap="48" data-mx="auto">
          <button
            type="button"
            class="c-button"
            data-variant="primary"
            onClick={() => archiveTracker.mutate({ id })}
          >
            {t("tracker.archive")}
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
