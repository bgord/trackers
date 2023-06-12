import * as bg from "@bgord/frontend";
import { h } from "preact";
import { useMutation, useQueryClient } from "react-query";

import * as api from "./api";
import * as types from "./types";

export function SettingsEmailDelete(_props: types.SettingsType) {
  const t = bg.useTranslations();
  const queryClient = useQueryClient();

  const notify = bg.useToastTrigger();

  const deleteEmail = useMutation(api.Settings.emailDelete, {
    onSuccess: () => {
      queryClient.invalidateQueries("settings");
      notify({ message: "settings.email.delete.success" });
    },
    onError: (error: bg.ServerError) => notify({ message: error.message }),
  });

  return (
    <button
      class="c-button"
      data-variant="bare"
      type="button"
      onClick={() => deleteEmail.mutate()}
      disabled={deleteEmail.isLoading}
    >
      {t("settings.email.delete")}
    </button>
  );
}
