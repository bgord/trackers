import * as bg from "@bgord/frontend";
import { h } from "preact";
import { useMutation, useQueryClient } from "react-query";

import * as api from "./api";
import * as types from "./types";

export function TaskCreate(props: Pick<types.ProjectType, "id">) {
  const t = bg.useTranslations();
  const notify = bg.useToastTrigger();
  const queryClient = useQueryClient();

  const taskName = bg.useField<types.ProjectType["name"]>("task-name", "");

  const createTask = useMutation(api.Task.create, {
    onSuccess: () => {
      taskName.clear();
      queryClient.invalidateQueries(["tasks", props.id]);
      notify({ message: "project.create.success" });
    },
    onError: (error: bg.ServerError) => notify({ message: error.message }),
  });

  return (
    <form
      data-display="flex"
      data-gap="24"
      onSubmit={(event) => {
        event.preventDefault();
        createTask.mutate({ name: taskName.value, projectId: props.id });
      }}
    >
      <div data-display="flex" data-direction="column">
        <label class="c-label" {...taskName.label.props}>
          {t("task.name.label")}
        </label>
        <input
          class="c-input"
          onChange={(event) => taskName.set(event.currentTarget.value)}
          pattern={`.{${types.TASK_NAME_MIN_LENGTH},${types.TASK_NAME_MAX_LENGTH}}`}
          placeholder={t("task.name.placeholder")}
          required
          style={{ minWidth: "200px" }}
          value={taskName.value}
          {...taskName.input.props}
        />
      </div>

      <button
        type="submit"
        class="c-button"
        data-variant="secondary"
        data-self="end"
      >
        {t("task.create.submit")}
      </button>
    </form>
  );
}
