import * as bg from "@bgord/frontend";
import * as Icons from "iconoir-react";
import { h, Fragment } from "preact";
import { useQueryClient, useMutation } from "react-query";

import * as api from "./api";
import * as types from "./types";

export function ProjectDelete(
  props: types.ProjectType & h.JSX.IntrinsicElements["button"]
) {
  const { id, ...rest } = props;

  const t = bg.useTranslations();

  const queryClient = useQueryClient();
  const notify = bg.useToastTrigger();
  const dialog = bg.useToggle();

  const deleteProject = useMutation(api.Project.delete, {
    onSuccess() {
      dialog.disable();
      notify({ message: "project.delete.success" });
      queryClient.invalidateQueries("projects");
    },
    onError() {
      setTimeout(deleteProject.reset, 5000);
      notify({ message: "project.delete.error" });
      dialog.disable();
    },
  });

  return (
    <>
      <button
        type="button"
        onClick={dialog.enable}
        disabled={deleteProject.isLoading || deleteProject.isSuccess}
        class="c-button"
        data-variant="bare"
        title={t("project.delete")}
        {...rest}
      >
        <Icons.DeleteCircledOutline height="24" width="24" />
      </button>

      <bg.Dialog {...dialog} data-gap="24" data-mt="72">
        <div>{t("project.delete.confirmation")}</div>

        <div data-display="flex" data-gap="48" data-mx="auto">
          <button
            type="button"
            class="c-button"
            data-variant="primary"
            onClick={() => deleteProject.mutate({ id })}
          >
            {t("app.delete")}
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
