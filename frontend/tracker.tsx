import * as bg from "@bgord/frontend";
import * as Icons from "iconoir-react";
import { h } from "preact";

import * as types from "./types";

import { TrackerSync } from "./tracker-sync";
import { TrackerDelete } from "./tracker-delete";
import { TrackerExport } from "./tracker-export";
import { TrackerSyncDatapoints } from "./tracker-sync-datapoints";

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
          <TrackerSync key={props.updatedAt} {...props} />
          <TrackerSyncDatapoints key={props.updatedAt} {...props} />
        </div>
      )}
    </li>
  );
}
