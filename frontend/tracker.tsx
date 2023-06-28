import * as bg from "@bgord/frontend";
import * as Icons from "iconoir-react";
import { h } from "preact";

import * as types from "./types";

import { TrackerSync } from "./tracker-sync";
import { TrackerNameChange } from "./tracker-name-change";
import { TrackerDelete } from "./tracker-delete";
import { TrackerArchive } from "./tracker-archive";
import { TrackerExport } from "./tracker-export";
import { TrackerRestore } from "./tracker-restore";
import { TrackerDatapointList } from "./tracker-datapoint-list";
import { TrackerMetadata } from "./tracker-metadata";

import { Goal } from "./goal";

export function Tracker(props: types.TrackerType) {
  const t = bg.useTranslations();

  const details = bg.usePersistentToggle(`tracker-details-${props.id}`);

  return (
    <li
      data-display="flex"
      data-gap="12"
      data-direction="column"
      data-max-width="100%"
    >
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

        {props.status === types.TrackerStatusEnum.active && (
          <div class="c-badge" data-color="green-600" data-bg="green-100">
            {t(`tracker.status.${props.status}`)}
          </div>
        )}

        {props.status === types.TrackerStatusEnum.archived && (
          <div class="c-badge">{t(`tracker.status.${props.status}`)}</div>
        )}

        <div class="c-badge">{t(`tracker.kind.enum.${props.kind}`)}</div>

        <div data-fs="14" data-color="gray-700">
          {props.name}
        </div>

        <div data-fs="14" data-fw="700" data-mr="48">
          {props.value}
        </div>

        {details.on && props.status === types.TrackerStatusEnum.active && (
          <TrackerArchive {...props} />
        )}

        {details.on && props.status === types.TrackerStatusEnum.archived && (
          <TrackerRestore {...props} />
        )}

        {details.on && <TrackerExport {...props} />}

        {details.on && <TrackerDelete {...props} />}
      </div>

      {details.on && (
        <div
          data-display="flex"
          data-direction="column"
          data-max-width="100%"
          data-gap="24"
        >
          {props.status === types.TrackerStatusEnum.active && (
            <div data-display="flex" data-cross="start" data-gap="48">
              <TrackerSync key={props.updatedAt} {...props} />
              <TrackerNameChange {...props} />
            </div>
          )}

          <Goal key={props.updatedAt} {...props} />

          {props.kind === types.TrackerKindEnum.one_value && (
            <TrackerDatapointList key={props.updatedAt.raw} {...props} />
          )}

          <TrackerMetadata {...props} />
        </div>
      )}
    </li>
  );
}
