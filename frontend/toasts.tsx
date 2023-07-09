import { h } from "preact";
import * as bg from "@bgord/frontend";

import * as types from "./types";

export function Toasts() {
  const [_toasts] = bg.useToastsContext<types.ToastType>();
  const toasts = bg.useAnimaList(_toasts, { direction: "tail" });

  return (
    <bg.AnimaList
      data-position="fixed"
      data-bottom="0"
      data-right="0"
      data-mb="12"
      data-pt="12"
      data-width="100%"
      style={{
        ...bg.Rhythm.base().times(24).maxWidth,
        ...bg.Rhythm.base().times(25).maxHeight,
      }}
    >
      {toasts.items.map((toast) => (
        <bg.Anima key={toast.item.id} effect="opacity" {...toast.props}>
          <Toast {...toast} />
        </bg.Anima>
      ))}
    </bg.AnimaList>
  );
}

function Toast(props: bg.UseAnimaListItemType<types.ToastType>) {
  const t = bg.useTranslations();

  return (
    <li
      aria-live="polite"
      data-py="6"
      data-px="12"
      data-mt="12"
      data-fs="14"
      data-color="gray-700"
      data-bg="gray-200"
      data-br="2"
      box-shadow
    >
      <span data-transform="upper-first">{t(props.item.message)}</span>
    </li>
  );
}
