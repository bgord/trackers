import * as bg from "@bgord/frontend";
import { h } from "preact";
import { useMutation, useQueryClient } from "react-query";

import * as api from "./api";
import * as types from "./types";
import * as UI from "./ui";

export function SettingsEmailChange() {
  const t = bg.useTranslations();
  const queryClient = useQueryClient();

  const notify = bg.useToastTrigger();

  const newEmailField = bg.useField<NonNullable<types.SettingsType["email"]>>(
    "new-email-field",
    "" as NonNullable<types.SettingsType["email"]>
  );
  const changeEmail = useMutation(api.Settings.emailChange, {
    onSuccess: () => {
      queryClient.invalidateQueries("settings");
      notify({ message: "settings.email.change.success" });
      newEmailField.clear();
    },
    onError: (error: bg.ServerError) => notify({ message: error.message }),
  });

  return (
    <form
      data-display="flex"
      data-cross="end"
      data-wrap="nowrap"
      data-width="100%"
      data-gap="12"
      onSubmit={(event) => {
        event.preventDefault();
        changeEmail.mutate({ email: newEmailField.value });
      }}
    >
      <div
        data-display="flex"
        data-direction="column"
        data-wrap="nowrap"
        data-width="100%"
      >
        <label class="c-label" {...newEmailField.label.props}>
          {t("settings.email.new.label")}
        </label>

        <input
          class="c-input"
          onChange={(event) => newEmailField.set(event.currentTarget.value)}
          inputMode="email"
          placeholder={t("settings.email.new.placeholder")}
          required
          data-width="100%"
          value={newEmailField.value}
          disabled={changeEmail.isLoading}
          {...newEmailField.input.props}
        />
      </div>

      <button
        class="c-button"
        data-variant="primary"
        type="submit"
        disabled={changeEmail.isLoading}
      >
        {t("settings.email.change")}
      </button>

      <UI.Clear
        onClick={newEmailField.clear}
        disabled={changeEmail.isLoading}
      />
    </form>
  );
}
