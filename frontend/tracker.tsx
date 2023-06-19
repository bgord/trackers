import * as bg from "@bgord/frontend";
import * as Icons from "iconoir-react";
import { h } from "preact";

import * as types from "./types";
import * as UI from "./ui";

import { TrackerSync } from "./tracker-sync";
import { TrackerNameChange } from "./tracker-name-change";
import { TrackerDelete } from "./tracker-delete";
import { TrackerExport } from "./tracker-export";
import { TrackerDatapointList } from "./tracker-datapoint-list";

export function Tracker(props: types.TrackerType) {
  const t = bg.useTranslations();

  const details = bg.usePersistentToggle(`tracker-details-${props.id}`);

  return (
    <li data-display="flex" data-direction="column" data-max-width="100%">
      <div data-display="flex" data-cross="center" data-gap="12">
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

        <div class="c-badge">{t(`tracker.kind.enum.${props.kind}`)}</div>
        <div data-fs="14" data-color="gray-700">
          {props.name}
        </div>

        <div data-fs="14" data-fw="700">
          {props.value}
        </div>

        {details.on && <TrackerDelete data-ml="24" {...props} />}
        {details.on && <TrackerExport {...props} />}
      </div>

      {details.on && (
        <div
          data-display="flex"
          data-direction="column"
          data-max-width="100%"
          data-gap="36"
        >
          <div data-display="flex" data-cross="end" data-gap="48">
            <TrackerSync key={props.updatedAt} {...props} />
            <TrackerNameChange {...props} />
          </div>
          {props.kind === types.TrackerKindEnum.one_value && (
            <TrackerDatapointList key={props.updatedAt.raw} {...props} />
          )}
          <div data-display="flex" data-gap="24">
            <UI.Info title={bg.DateFormatter.datetime(props.createdAt.raw)}>
              {t("tracker.created_at", { value: props.createdAt.relative })}
            </UI.Info>

            <UI.Info title={bg.DateFormatter.datetime(props.createdAt.raw)}>
              {t("tracker.updated_at", { value: props.updatedAt.relative })}
            </UI.Info>
          </div>
        </div>
      )}
    </li>
  );
}
