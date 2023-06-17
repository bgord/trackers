import express from "express";
import render from "preact-render-to-string";
import * as bg from "@bgord/node";

import * as Settings from "../modules/settings";
import * as Trackers from "../modules/trackers";
import * as Projects from "../modules/projects";

import * as infra from "../infra";

import { App } from "../frontend/app";

export async function Dashboard(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  const translations = await bg.I18n.getTranslations(
    request.language,
    request.translationsPath
  );

  const state = {
    ...(await bg.BuildInfoRepository.extract()),
    language: request.language,
    translations,
    trackers: await Trackers.Repos.TrackerRepository.list(),
    settings: await Settings.Repos.SettingsRepository.get(),
    projects: await Projects.Repos.ProjectRepository.list(),
  };

  const frontend = render(App({ ...state, url: request.url }));
  const html = infra.Html.process({
    frontend,
    state,
    language: request.language,
  });

  return response.send(html);
}
