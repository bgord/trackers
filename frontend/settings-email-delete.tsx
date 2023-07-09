import * as bg from "@bgord/frontend";
import * as Icons from "iconoir-react";
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
        title={t("settings.email.delete")}
      >
        <Icons.BinMinus height="20" width="20" data-color="red-500" />
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
