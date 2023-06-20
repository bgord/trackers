import * as bg from "@bgord/frontend";
import * as Icons from "iconoir-react";
import { h, Fragment } from "preact";
import { useQueryClient, useMutation } from "react-query";

import * as api from "./api";
import * as types from "./types";

export function ProjectRestore(
  props: types.ProjectType & h.JSX.IntrinsicElements["button"]
) {
  const { id, ...rest } = props;

  const t = bg.useTranslations();

  const queryClient = useQueryClient();
  const notify = bg.useToastTrigger();
  const dialog = bg.useToggle();

  const restoreProject = useMutation(api.Project.restore, {
    onSuccess() {
      dialog.disable();
      notify({ message: "project.restore.success" });
      queryClient.invalidateQueries("projects");
    },
    onError(error: bg.ServerError) {
      setTimeout(restoreProject.reset, 5000);
      notify({ message: error.message });
      dialog.disable();
    },
  });

  return (
    <>
      <button
        type="button"
        onClick={dialog.enable}
        disabled={restoreProject.isLoading || restoreProject.isSuccess}
        class="c-button"
        data-variant="bare"
        title={t("project.restore")}
        {...rest}
      >
        <Icons.Restart height="24" width="24" />
      </button>

      <bg.Dialog {...dialog} data-gap="24" data-mt="72">
        <div>{t("project.restore.confirmation")}</div>

        <div data-display="flex" data-gap="48" data-mx="auto">
          <button
            type="button"
            class="c-button"
            data-variant="primary"
            onClick={() => restoreProject.mutate({ id })}
          >
            {t("project.restore")}
          </button>

          <button
            type="button"
            class="c-button"
            data-variant="bare"
            onClick={dialog.disable}
          >
            {t("app.cancel")}
          </button>
        </div>
      </bg.Dialog>
    </>
  );
}
