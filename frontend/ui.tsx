import * as bg from "@bgord/frontend";
import * as Icons from "iconoir-react";
import { h } from "preact";

export function Info(props: h.JSX.IntrinsicElements["div"]) {
  return (
    <div
      data-display="flex"
      data-cross="center"
      data-fs="12"
      data-color="gray-600"
      {...props}
    />
  );
}

export function ClearButton(props: h.JSX.IntrinsicElements["button"]) {
  const t = bg.useTranslations();

  return (
    <button
      title={t("app.clear")}
      type="button"
      class="c-button"
      data-variant="bare"
      data-display="flex"
      data-main="center"
      data-cross="center"
      {...props}
    >
      <Icons.Cancel width="24" height="24" />
    </button>
  );
}

export function Select(props: h.JSX.IntrinsicElements["select"]) {
  return (
    <div class="c-select-wrapper">
      <select class="c-select" data-width="100%" {...props} />
    </div>
  );
}
