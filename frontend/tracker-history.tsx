import * as bg from "@bgord/frontend";
import * as Icons from "iconoir-react";
import { h, Fragment } from "preact";
import { useQuery } from "react-query";

import * as types from "./types";
import * as api from "./api";
import * as UI from "./ui";

export function TrackerHistory(
  props: types.TrackerType & h.JSX.IntrinsicElements["button"]
) {
  const { id, ...rest } = props;

  const t = bg.useTranslations();
  const dialog = bg.useToggle();

  const page = bg.useField("page", 1);

  const history = useQuery(
    ["history", id, page.value],
    () => api.History.list(id, page.value),
    { enabled: dialog.on }
  );

  return (
    <>
      <button
        type="button"
        onClick={dialog.enable}
        class="c-button"
        data-variant="bare"
        title={t("tracker.export")}
        {...rest}
      >
        {t("tracker.history")}
      </button>

      <bg.Dialog
        {...dialog}
        data-wrap="nowrap"
        data-gap="24"
        data-mt="72"
        data-max-width="768"
        data-width="100%"
        data-px="12"
        style={bg.Rhythm.base().times(50).maxHeight}
      >
        <div data-display="flex" data-main="between" data-cross="center">
          <div data-fs="14" data-fw="700">
            {t("tracker.history")}
          </div>

          <button
            type="button"
            class="c-button"
            data-variant="with-icon"
            title={t("app.close")}
            onClick={dialog.disable}
          >
            <Icons.Cancel width="20" height="20" />
          </button>
        </div>

        <ul>
          {history.data?.result.map((item) => (
            <li data-display="flex" data-main="between">
              <div data-fs="14" data-color="gray-600">
                {t(item.operation, item.payload)}
              </div>

              <UI.Info>{item.createdAt.relative}</UI.Info>
            </li>
          ))}
        </ul>
      </bg.Dialog>
    </>
  );
}
