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
        data-mt="48"
        data-max-width="768"
        data-width="100%"
        data-p="24"
        data-md-p="6"
        style={bg.Rhythm.base().times(50).height}
      >
        <div data-display="flex" data-main="between" data-cross="center">
          <div data-fw="700">{t("tracker.history")}</div>

          <button
            type="button"
            class="c-button"
            data-variant="with-icon"
            title={t("app.close")}
            onClick={bg.exec([
              dialog.disable,
              pagination.controls.firstPage.go,
              history.remove,
            ])}
          >
            <Icons.Cancel width="20" height="20" />
          </button>
        </div>

        {history.isLoading && (
          <div data-fs="14" data-color="gray-600">
            {t("app.loading")}
          </div>
        )}

        {history.isError && (
          <div data-fs="14" data-color="gray-600">
            {t("history.error")}
          </div>
        )}

        <ul data-display="flex" data-direction="column" data-md-gap="6">
          {history.data?.result.map((item) => (
            <li data-display="flex" data-main="between" key={item.id}>
              <div data-fs="14" data-color="gray-600">
                - {t(item.operation, item.payload)}
              </div>

              <UI.Info
                data-color="gray-400"
                data-ml="auto"
                title={bg.DateFormatter.datetime(item.createdAt.raw)}
              >
                {item.createdAt.relative}
              </UI.Info>
            </li>
          ))}
        </ul>

        <div
          data-display="flex"
          data-main="between"
          data-cross="center"
          data-mt="auto"
        >
          <div data-display="flex" data-wrap="nowrap" data-gap="24">
            <button
              type="button"
              class="c-button"
              disabled={pagination.controls.firstPage.active}
              data-variant="bare"
              onClick={pagination.controls.firstPage.go}
            >
              {t("app.pagination.first")}
            </button>

            <button
              type="button"
              class="c-button"
              disabled={pagination.controls.previousPage.disabled}
              data-variant="bare"
              onClick={pagination.controls.previousPage.go}
            >
              {t("app.pagination.previous")}
            </button>
          </div>

          <UI.Info>
            {t("history.page", {
              current: pagination.current,
              total: pagination.last ?? pagination.current,
            })}
          </UI.Info>

          <div data-display="flex" data-wrap="nowrap" data-gap="24">
            <button
              type="button"
              class="c-button"
              disabled={pagination.controls.nextPage.disabled}
              data-variant="bare"
              onClick={pagination.controls.nextPage.go}
            >
              {t("app.pagination.next")}
            </button>

            <button
              type="button"
              class="c-button"
              disabled={pagination.controls.lastPage.disabled}
              data-variant="bare"
              onClick={pagination.controls.lastPage.go}
            >
              {t("app.pagination.last")}
            </button>
          </div>
        </div>
      </bg.Dialog>
    </>
  );
}
