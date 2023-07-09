import * as bg from "@bgord/frontend";
import { h, Fragment } from "preact";
import * as Icons from "iconoir-react";

import * as types from "./types";

import { SettingsEmailDelete } from "./settings-email-delete";
import { SettingsEmailChange } from "./settings-email-change";

export function SettingsEmail(props: types.SettingsType) {
  const t = bg.useTranslations();

  const details = bg.usePersistentToggle("settings-email");
  const emailChangeForm = bg.useToggle();

  return (
    <div
      data-display="flex"
      data-direction="column"
      data-gap="24"
      data-md-gap="12"
      data-max-width="100%"
    >
      <div
        data-display="flex"
        data-cross="center"
        data-gap="24"
        data-md-gap="12"
      >
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

        <div data-fs="14">{t("settings.email")}</div>

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
            <div
              data-display="flex"
              data-cross="center"
              data-gap="24"
              data-md-gap="12"
              data-width="100%"
              data-max-width="100%"
            >
              <div class="c-badge">{t("settings.email.current")}</div>

              <div
                data-fs="14"
                title={props.email}
                data-transform="truncate"
                data-max-width="100%"
              >
                {props.email}
              </div>

              <div data-display="flex" data-wrap="nowrap" data-gap="12">
                <button
                  type="button"
                  class="c-button"
                  data-variant="bare"
                  onClick={emailChangeForm.toggle}
                >
                  {t("settings.email.trigger.change")}
                </button>

                <SettingsEmailDelete {...props} />
              </div>
            </div>
          )}

          {(!props.email || emailChangeForm.on) && <SettingsEmailChange />}
        </Fragment>
      )}
    </div>
  );
}
