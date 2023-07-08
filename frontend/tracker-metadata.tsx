import { h } from "preact";
import * as bg from "@bgord/frontend";
import * as Icons from "iconoir-react";

import * as types from "./types";
import * as UI from "./ui";

import { TrackerHistory } from "./tracker-history";

export function TrackerMetadata(props: types.TrackerType) {
  const t = bg.useTranslations();

  return (
    <div data-display="flex" data-gap="12">
      <div data-display="flex" data-gap="12">
        <UI.Info
          title={bg.DateFormatter.datetime(props.createdAt.raw)}
          data-color="gray-400"
        >
          <Icons.ClockOutline height="14" width="14" data-mr="6" />
          {t("tracker.created_at", { value: props.createdAt.relative })}
        </UI.Info>

        <UI.Info
          title={bg.DateFormatter.datetime(props.createdAt.raw)}
          data-color="gray-400"
        >
          <Icons.ClockOutline height="14" width="14" data-mr="6" />
          {t("tracker.updated_at", { value: props.updatedAt.relative })}
        </UI.Info>
      </div>

      <TrackerHistory
        data-ml="auto"
        data-md-ml="0"
        data-md-mr="auto"
        {...props}
      />
    </div>
  );
}
