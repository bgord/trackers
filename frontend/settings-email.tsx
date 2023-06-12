import * as bg from "@bgord/frontend";
import { h, Fragment } from "preact";
import * as Icons from "iconoir-react";

import * as types from "./types";
import * as UI from "./ui";

import { SettingsEmailDelete } from "./settings-email-delete";
import { SettingsEmailChange } from "./settings-email-change";

export function SettingsEmail(props: types.SettingsType) {
  const t = bg.useTranslations();
  const details = bg.usePersistentToggle("settings-email");

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
          {props.email && (
            <div data-display="flex" data-gap="24" data-wrap="nowrap">
              <UI.Info data-fs="14" data-transform="nowrap">
                {t("settings.email.current", { value: props.email })}
              </UI.Info>

              <SettingsEmailDelete {...props} />
            </div>
          )}

          <SettingsEmailChange />
        </Fragment>
      )}
    </div>
  );
}
