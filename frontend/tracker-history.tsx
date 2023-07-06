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

  const pagination = bg.usePagination();

  const history = useQuery(
    ["history", id, pagination.current],
    () => api.History.list(id, pagination.current),
    { onSuccess: (data) => pagination.update(data.meta), enabled: dialog.on }
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
        style={bg.Rhythm.base().times(45).height}
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

        <div
          data-display="flex"
          data-main="between"
          data-cross="center"
          data-mt="auto"
        >
          <button
            type="button"
            class="c-button"
            disabled={pagination.buttons.firstPage.active}
            data-variant="secondary"
            onClick={pagination.buttons.firstPage.go}
          >
            {t("app.pagination.first")}
          </button>

          <button
            type="button"
            class="c-button"
            disabled={pagination.buttons.previousPage.disabled}
            data-variant="secondary"
            onClick={pagination.buttons.previousPage.go}
          >
            {t("app.pagination.previous")}
          </button>

          <strong data-fs="12" data-color="gray-600">
            Page {pagination.current} / {pagination.last}
          </strong>

          <button
            type="button"
            class="c-button"
            disabled={pagination.buttons.nextPage.disabled}
            data-variant="secondary"
            onClick={pagination.buttons.nextPage.go}
          >
            {t("app.pagination.next")}
          </button>

          <button
            type="button"
            class="c-button"
            disabled={pagination.buttons.lastPage.disabled}
            data-variant="secondary"
            onClick={pagination.buttons.lastPage.go}
          >
            {t("app.pagination.last")}
          </button>
        </div>
      </bg.Dialog>
    </>
  );
}
