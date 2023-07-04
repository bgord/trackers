import * as bg from "@bgord/frontend";
import * as Icons from "iconoir-react";
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
  const details = bg.usePersistentToggle(`tracker-details-${props.id}`);

  const deleteTracker = useMutation(api.Tracker.delete, {
    onSuccess() {
      dialog.disable();
      notify({ message: "tracker.delete.success" });
      queryClient.invalidateQueries("trackers");
      details.clear();
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
        disabled={!deleteTracker.isIdle}
        class="c-button"
        data-variant="bare"
        title={t("tracker.delete")}
        {...rest}
      >
        <Icons.DeleteCircledOutline height="24" width="24" />
      </button>

      <bg.Dialog {...dialog} data-gap="24" data-mt="72">
        <div>{t("tracker.delete.confirmation")}</div>

        <div data-transform="center" data-fs="14" data-fw="700" data-ls="0.5">
          {t("tracker.delete.warning")}
        </div>

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
