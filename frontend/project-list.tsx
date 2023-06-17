import * as bg from "@bgord/frontend";
import { h } from "preact";
import { useQuery } from "react-query";

import * as api from "./api";
import * as UI from "./ui";

import { Project } from "./project";

export function ProjectList() {
  const t = bg.useTranslations();

  const projectListQuery = useQuery("projects", api.Project.list, {
    refetchOnMount: true,
  });
  const projects = projectListQuery.data ?? [];

  if (projectListQuery.isLoading) {
    return <UI.Info data-mx="24">{t("app.loading")}</UI.Info>;
  }

  if (projectListQuery.isError) {
    return <UI.Info data-mx="24">{t("project.list.error")}</UI.Info>;
  }

  if (projectListQuery.data?.length === 0) {
    return <UI.Info data-mx="24">{t("project.list.empty")}</UI.Info>;
  }

  return (
    <ul data-display="flex" data-direction="column" data-gap="24" data-m="24">
      {projects.map((project) => (
        <Project key={project.id} {...project} />
      ))}
    </ul>
  );
}
