import * as bg from "@bgord/frontend";
import * as Icons from "iconoir-react";
import { h, Fragment } from "preact";
import { useQueryClient, useMutation } from "react-query";

import * as api from "./api";
import * as types from "./types";

export function GoalDelete(props: types.GoalType) {
  const t = bg.useTranslations();

  const queryClient = useQueryClient();
  const notify = bg.useToastTrigger();
  const dialog = bg.useToggle();

  const deleteGoal = useMutation(api.Goal.delete, {
    onSuccess() {
      dialog.disable();
      notify({ message: "goal.delete.success" });
      queryClient.invalidateQueries(["goal", props.relatedTrackerId]);
      queryClient.removeQueries(["goal", props.relatedTrackerId]);
    },
    onError() {
      setTimeout(deleteGoal.reset, 5000);
      notify({ message: "goal.delete.error" });
      dialog.disable();
    },
  });

  return (
    <>
      <button
        type="button"
        onClick={dialog.enable}
        disabled={!deleteGoal.isIdle}
        class="c-button"
        data-variant="bare"
        data-pt="3"
        title={t("goal.delete")}
      >
        <Icons.BinMinus height="18" width="18" />
      </button>

      <bg.Dialog {...dialog} data-gap="24" data-mt="72" data-md-px="6">
        <div data-lh="16" data-transform="center">
          {t("goal.delete.confirmation")}
        </div>

        <div data-display="flex" data-gap="48" data-mx="auto">
          <button
            type="button"
            class="c-button"
            data-variant="primary"
            onClick={() => deleteGoal.mutate({ id: props.id })}
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
