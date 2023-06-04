import * as bg from "@bgord/frontend";
import * as Icons from "iconoir-react";
import { h } from "preact";

import * as types from "./types";
import { TrackerSync } from "./tracker-sync";

export function Tracker(props: types.TrackerType) {
  const t = bg.useTranslations();

  const details = bg.useToggle();

  return (
    <li data-display="flex" data-direction="column">
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
          {details.off && <Icons.NavArrowDown height="24" width="24" />}
          {details.on && <Icons.NavArrowUp height="24" width="24" />}
        </button>

        <div class="c-badge">{t(`tracker.kind.enum.${props.kind}`)}</div>
        <div data-fs="14" data-color="gray-700">
          {props.name}
        </div>
      </div>

      {details.on && (
        <div>
          <TrackerSync {...props} />
        </div>
      )}
    </li>
  );
}
