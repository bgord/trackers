import * as bg from "@bgord/frontend";
import * as Icons from "iconoir-react";
import { h } from "preact";

import * as types from "./types";
import * as UI from "./ui";

export function Task(props: types.TaskType) {
  const t = bg.useTranslations();

  const details = bg.usePersistentToggle(`task-details-${props.id}`);

  return (
    <li
      data-display="flex"
      data-direction="column"
      data-max-width="100%"
      data-gap="24"
    >
      <div data-display="flex" data-cross="center" data-gap="24">
        <button
          class="c-button"
          type="button"
          data-variant="with-icon"
          title={
            details.on ? t("tracker.details.hide") : t("tracker.details.show")
          }
          onClick={details.toggle}
        >
          {details.off && <Icons.NavArrowRight height="24" width="24" />}
          {details.on && <Icons.NavArrowDown height="24" width="24" />}
        </button>

        <div data-fs="14" data-color="gray-700">
          {props.name}
        </div>
      </div>

      {details.on && (
        <div
          data-display="flex"
          data-direction="column"
          data-max-width="100%"
          data-gap="36"
        >
          <div data-display="flex" data-gap="24">
            <UI.Info title={bg.DateFormatter.datetime(props.createdAt.raw)}>
              {t("project.created_at", { value: props.createdAt.relative })}
            </UI.Info>

            <UI.Info title={bg.DateFormatter.datetime(props.updatedAt.raw)}>
              {t("project.updated_at", { value: props.updatedAt.relative })}
            </UI.Info>
          </div>
        </div>
      )}
    </li>
  );
}
