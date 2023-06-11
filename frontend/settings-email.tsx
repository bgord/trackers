import * as bg from "@bgord/frontend";
import { h, Fragment } from "preact";
import { useMutation, useQueryClient } from "react-query";
import * as Icons from "iconoir-react";

import * as api from "./api";
import * as types from "./types";
import * as UI from "./ui";

export function SettingsEmail(props: types.SettingsType) {
  const t = bg.useTranslations();
  const queryClient = useQueryClient();
  const details = bg.usePersistentToggle("settings-email");

  const notify = bg.useToastTrigger();

  const newEmailField = bg.useField<types.SettingsEmailType>(
    "new-email-field",
    "" as types.SettingsEmailType
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
    <div data-display="flex" data-direction="column" data-gap="24">
      <div data-display="flex" data-gap="24" data-cross="center">
        {!props.email && (
          <div class="c-badge" data-color="red-600" data-bg="red-100">
            {t("settings.email.empty")}
          </div>
        )}

        {props.email && (
          <div class="c-badge" data-color="green-600" data-bg="green-100">
            {t("settings.email.set")}
          </div>
        )}

        {t("settings.email")}

        {details.on && (
          <button
            type="button"
            class="c-button"
            data-variant="bare"
            onClick={details.toggle}
            data-ml="auto"
            title={t("settings.email.hide")}
          >
            <Icons.NavArrowDown height="24" width="24" />
          </button>
        )}

        {details.off && (
          <button
            type="button"
            class="c-button"
            data-variant="bare"
            onClick={details.toggle}
            data-ml="auto"
            title={t("settings.email.show")}
          >
            <Icons.NavArrowLeft height="24" width="24" />
          </button>
        )}
      </div>

      {details.on && (
        <Fragment>
          <div
            data-display="flex"
            data-cross="end"
            data-gap="24"
            data-wrap="nowrap"
          >
            {props.email && (
              <UI.Info data-fs="14" data-transform="nowrap">
                {t("settings.email.current", { value: props.email })}
              </UI.Info>
            )}
          </div>

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
                onChange={(event) =>
                  newEmailField.set(event.currentTarget.value)
                }
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

            <UI.ClearButton
              onClick={newEmailField.clear}
              disabled={changeEmail.isLoading}
            />
          </form>
        </Fragment>
      )}
    </div>
  );
}
