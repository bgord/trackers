import * as bg from "@bgord/frontend";
import { h, Fragment } from "preact";
import { useMutation, useQueryClient } from "react-query";

import * as api from "./api";
import * as types from "./types";

export function SettingsEmailDelete(_props: types.SettingsType) {
  const t = bg.useTranslations();
  const queryClient = useQueryClient();

  const notify = bg.useToastTrigger();
  const dialog = bg.useToggle();

  const deleteEmail = useMutation(api.Settings.emailDelete, {
    onSuccess: () => {
      queryClient.invalidateQueries("settings");
      notify({ message: "settings.email.delete.success" });
    },
    onError: (error: bg.ServerError) => notify({ message: error.message }),
  });

  return (
    <>
      <button
        class="c-button"
        data-variant="bare"
        type="button"
        disabled={deleteEmail.isLoading}
        onClick={dialog.enable}
      >
        {deleteEmail.isIdle && t("settings.email.delete")}
        {deleteEmail.isLoading && t("settings.email.delete.loading")}
        {deleteEmail.isSuccess && t("settings.email.delete.success")}
        {deleteEmail.isError && t("settings.email.delete.error")}
      </button>

      <bg.Dialog {...dialog} data-gap="24" data-mt="72">
        <div data-lh="16" data-transform="center">
          {t("tracker.export.email.confirmation")}
        </div>

        <form
          data-display="flex"
          data-direction="column"
          data-gap="24"
          onSubmit={(event) => {
            event.preventDefault();
            deleteEmail.mutate();
          }}
        >
          <div data-display="flex" data-gap="48" data-mx="auto">
            <button type="submit" class="c-button" data-variant="primary">
              {t("settings.email.delete")}
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
        </form>
      </bg.Dialog>
    </>
  );
}
