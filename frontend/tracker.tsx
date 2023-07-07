import * as bg from "@bgord/frontend";
import * as Icons from "iconoir-react";
import { h } from "preact";

import * as types from "./types";

import { DatapointList } from "./datapoint-list";
import { Goal } from "./goal";
import { TrackerArchive } from "./tracker-archive";
import { TrackerDelete } from "./tracker-delete";
import { TrackerExport } from "./tracker-export";
import { TrackerMetadata } from "./tracker-metadata";
import { TrackerNameChange } from "./tracker-name-change";
import { TrackerRestore } from "./tracker-restore";
import { TrackerSync } from "./tracker-sync";

export function Tracker(props: types.TrackerType) {
  const t = bg.useTranslations();

  const details = bg.usePersistentToggle(`tracker-details-${props.id}`);
  const nameChange = bg.useToggle();

  return (
    <li
      data-display="flex"
      data-gap="6"
      data-direction="column"
      data-max-width="100%"
    >
      <div data-display="flex" data-main="between" data-cross="center">
        <div data-display="flex" data-cross="center" data-gap="12">
          {props.status === types.TrackerStatusEnum.active && (
            <div
              class="c-badge"
              data-color="green-600"
              data-bg="green-100"
              style={bg.Rhythm.base().times(6.5).width}
            >
              {t(`tracker.status.${props.status}`)}
            </div>
          )}

          {props.status === types.TrackerStatusEnum.archived && (
            <div class="c-badge" style={bg.Rhythm.base().times(6.5).width}>
              {t(`tracker.status.${props.status}`)}
            </div>
          )}

          <div class="c-badge" style={bg.Rhythm.base().times(7.5).width}>
            {t(`tracker.kind.enum.${props.kind}`)}
          </div>

          <div data-fs="14" data-color="gray-700">
            {props.name}
          </div>

          <div data-fs="14" data-fw="700" data-mr="auto">
            {props.value}
          </div>
        </div>

        <div data-display="flex" data-cross="center">
          {details.on && props.status === types.TrackerStatusEnum.active && (
            <button
              class="c-button"
              type="button"
              data-variant="with-icon"
              onClick={nameChange.toggle}
              title={
                details.on
                  ? t("tracker.name.change.hide")
                  : t("tracker.name.change.show")
              }
            >
              <Icons.EditPencil height="20" width="20" />
            </button>
          )}

          {details.on && props.status === types.TrackerStatusEnum.active && (
            <TrackerArchive {...props} />
          )}

          {details.on && props.status === types.TrackerStatusEnum.archived && (
            <TrackerRestore {...props} />
          )}

          {details.on && <TrackerExport {...props} />}

          {details.on && <TrackerDelete {...props} />}

          <button
            class="c-button"
            type="button"
            data-variant="with-icon"
            title={
              details.on ? t("tracker.details.hide") : t("tracker.details.show")
            }
            onClick={details.toggle}
          >
            {details.off && <Icons.NavArrowLeft height="22" width="22" />}

            {details.on && <Icons.NavArrowDown height="22" width="22" />}
          </button>
        </div>
      </div>

      {details.on && (
        <div
          data-display="flex"
          data-direction="column"
          data-max-width="100%"
          data-gap="12"
        >
          {props.status === types.TrackerStatusEnum.active && nameChange.on && (
            <TrackerNameChange {...props} />
          )}

          <div>
            {props.status === types.TrackerStatusEnum.active && (
              <TrackerSync key={props.updatedAt} {...props} />
            )}

            <Goal key={props.updatedAt} {...props} />
          </div>

          <DatapointList key={props.updatedAt.raw} {...props} />

          <TrackerMetadata {...props} />
        </div>
      )}
    </li>
  );
}
