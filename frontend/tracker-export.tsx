import * as bg from "@bgord/frontend";
import * as Icons from "iconoir-react";
import { h, Fragment } from "preact";
import { useMutation, useQueryClient } from "react-query";

import * as api from "./api";
import * as types from "./types";
import * as UI from "./ui";

const DEFAULT_EXPORT_EMAIL = "";

export function TrackerExport(
  props: types.TrackerType & h.JSX.IntrinsicElements["button"]
) {
  const { id, ...rest } = props;

  const t = bg.useTranslations();
  const queryClient = useQueryClient();

  const notify = bg.useToastTrigger();
  const dialog = bg.useToggle();

  const trackerExportEmail = bg.useField<types.EmailType>(
    "tracker-export-email",
    () =>
      queryClient.getQueryData<types.SettingsType>("settings")?.email ??
      DEFAULT_EXPORT_EMAIL
  );

  const exportTracker = useMutation(api.Tracker.export, {
    onSuccess() {
      setTimeout(exportTracker.reset, 5000);
      dialog.disable();
      notify({ message: "tracker.export.success" });
      trackerExportEmail.clear();
    },
    onError(error: bg.ServerError) {
      setTimeout(exportTracker.reset, 5000);
      dialog.disable();
      notify({ message: error.message });
    },
  });

  return (
    <>
      <button
        type="button"
        onClick={dialog.enable}
        disabled={!exportTracker.isIdle}
        class="c-button"
        data-variant="with-icon"
        title={t("tracker.export")}
        {...rest}
      >
        <Icons.Download height="20" width="20" />
      </button>

      <bg.Dialog
        {...dialog}
        data-gap="24"
        data-mt="72"
        data-md-px="6"
        data-md-mx="auto"
      >
        <div data-lh="16" data-transform="center">
          {t("tracker.export.confirmation")}
        </div>

        <form
          data-display="flex"
          data-direction="column"
          data-gap="24"
          onSubmit={(event) => {
            event.preventDefault();
            exportTracker.mutate({ id, email: trackerExportEmail.value });
          }}
        >
          <div
            data-display="flex"
            data-wrap="nowrap"
            data-cross="end"
            data-gap="6"
          >
            <div data-display="flex" data-direction="column" data-width="100%">
              <label class="c-label" {...trackerExportEmail.label.props}>
                {t("tracker.export.email.label")}
              </label>
              <input
                class="c-input"
                onChange={(event) =>
                  trackerExportEmail.set(event.currentTarget.value)
                }
                type="email"
                inputMode="email"
                placeholder={t("tracker.export.email.placeholder")}
                required
                value={trackerExportEmail.value}
                style={bg.Rhythm.base().times(16.5).minWidth}
                {...trackerExportEmail.input.props}
              />
            </div>

            <UI.Clear
              disabled={trackerExportEmail.value === DEFAULT_EXPORT_EMAIL}
              onClick={() => trackerExportEmail.set(DEFAULT_EXPORT_EMAIL)}
            />
          </div>

          <div data-display="flex" data-gap="48" data-mx="auto">
            <button
              type="submit"
              class="c-button"
              data-variant="primary"
              disabled={trackerExportEmail.value === DEFAULT_EXPORT_EMAIL}
            >
              {t("app.export")}
            </button>

            <button
              type="button"
              class="c-button"
              data-variant="bare"
              onClick={bg.exec([dialog.disable, trackerExportEmail.clear])}
            >
              {t("app.cancel")}
            </button>
          </div>
        </form>
      </bg.Dialog>
    </>
  );
}
