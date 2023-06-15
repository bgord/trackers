import express from "express";
import render from "preact-render-to-string";
import * as bg from "@bgord/node";

import * as Repos from "../repositories";
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
    ...Repos.BuildRepository.getAll(),
    language: request.language,
    translations,
    trackers: await Repos.TrackerRepository.list(),
    settings: await Repos.SettingsRepository.get(),
  };

  const frontend = render(App({ ...state, url: request.url }));
  const html = infra.Html.process({
    frontend,
    state,
    language: request.language,
  });

  return response.send(html);
}
