import * as bg from "@bgord/frontend";
import { h } from "preact";
import { useMutation, useQueryClient } from "react-query";

import * as api from "./api";
import * as types from "./types";
import * as UI from "./ui";

export function ProjectCreate() {
  const t = bg.useTranslations();
  const notify = bg.useToastTrigger();
  const queryClient = useQueryClient();

  const projectName = bg.useField<types.ProjectType["name"]>(
    "project-name",
    ""
  );

  const createProject = useMutation(api.Project.create, {
    onSuccess: () => {
      projectName.clear();
      queryClient.invalidateQueries("projects");
      notify({ message: "project.create.success" });
    },
    onError: (error: bg.ServerError) => notify({ message: error.message }),
  });

  return (
    <form
      data-display="flex"
      data-gap="24"
      data-p="24"
      onSubmit={(event) => {
        event.preventDefault();
        createProject.mutate({
          name: projectName.value,
        });
      }}
    >
      <div data-display="flex" data-direction="column">
        <label class="c-label" {...projectName.label.props}>
          {t("project.name.label")}
        </label>
        <input
          class="c-input"
          onChange={(event) => projectName.set(event.currentTarget.value)}
          pattern={`.{${types.PROJECT_NAME_MIN_LENGTH},${types.PROJECT_NAME_MAX_LENGTH}}`}
          placeholder={t("project.name.placeholder")}
          required
          style={{ minWidth: "200px" }}
          value={projectName.value}
          {...projectName.input.props}
        />
      </div>

      <button
        type="submit"
        class="c-button"
        data-variant="secondary"
        data-self="end"
      >
        {t("project.create.submit")}
      </button>

      <UI.ClearButton data-self="end" onClick={projectName.clear} />
    </form>
  );
}
