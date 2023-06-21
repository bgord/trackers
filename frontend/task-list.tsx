import * as bg from "@bgord/frontend";
import { h } from "preact";
import { useQuery } from "react-query";

import * as api from "./api";
import * as UI from "./ui";
import * as types from "./types";

import { Task } from "./task";

export function TaskList(props: Pick<types.ProjectType, "id">) {
  const t = bg.useTranslations();

  const taskListQuery = useQuery(
    ["tasks", props.id],
    () => api.Task.list({ projectId: props.id }),
    { refetchOnMount: true }
  );
  const tasks = taskListQuery.data ?? [];

  if (taskListQuery.isLoading) {
    return <UI.Info>{t("app.loading")}</UI.Info>;
  }

  if (taskListQuery.isError) {
    return <UI.Info>{t("task.list.error")}</UI.Info>;
  }

  if (taskListQuery.data?.length === 0) {
    return <UI.Info>{t("task.list.empty")}</UI.Info>;
  }

  return (
    <ul data-display="flex" data-direction="column" data-gap="24">
      {tasks.map((task) => (
        <Task key={task.id} {...task} />
      ))}
    </ul>
  );
}
