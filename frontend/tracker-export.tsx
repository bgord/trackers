import * as bg from "@bgord/frontend";
import * as Icons from "iconoir-react";
import { h, Fragment } from "preact";
import { useMutation } from "react-query";

import * as api from "./api";
import * as types from "./types";

export function TrackerExport(
  props: types.TrackerType & h.JSX.IntrinsicElements["button"]
) {
  const { id, ...rest } = props;

  const t = bg.useTranslations();

  const notify = bg.useToastTrigger();
  const dialog = bg.useToggle();

  const email = bg.useField<types.EmailType>("tracker-export-email", "");

  const exportTracker = useMutation(api.Tracker.export, {
    onSuccess() {
      setTimeout(exportTracker.reset, 5000);
      dialog.disable();
      notify({ message: "tracker.export.success" });
      email.clear();
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
        data-variant="bare"
        title={t("tracker.export")}
        {...rest}
      >
        {exportTracker.isIdle && <Icons.Download height="24" width="24" />}
        {exportTracker.isLoading && t("tracker.export.in_progress")}
        {exportTracker.isSuccess && t("tracker.export.success")}
        {exportTracker.isError && t("tracker.export.error")}
      </button>

      <bg.Dialog {...dialog} data-gap="24" data-mt="72">
        <div>{t("tracker.export.confirmation")}</div>

        <form
          data-display="flex"
          data-direction="column"
          data-gap="24"
          onSubmit={(event) => {
            event.preventDefault();
            exportTracker.mutate({ id, email: email.value });
          }}
        >
          <div data-display="flex" data-direction="column">
            <label class="c-label" {...email.label.props}>
              {t("tracker.export.email.label")}
            </label>
            <input
              class="c-input"
              onChange={(event) => email.set(event.currentTarget.value)}
              type="email"
              inputMode="email"
              placeholder={t("tracker.export.email.placeholder")}
              required
              style={{ minWidth: "200px" }}
              value={email.value}
              {...email.input.props}
            />
          </div>

          <div data-display="flex" data-gap="48" data-mx="auto">
            <button type="submit" class="c-button" data-variant="primary">
              {t("app.export")}
            </button>

            <button
              type="button"
              class="c-button"
              data-variant="bare"
              onClick={bg.exec([dialog.disable, email.clear])}
            >
              {t("app.cancel")}
            </button>
          </div>
        </form>
      </bg.Dialog>
    </>
  );
}
