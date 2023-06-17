import express from "express";

import * as VO from "../value-objects";
import * as Aggregates from "../aggregates";

export async function SettingsEmailChange(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  const email = VO.SettingsEmail.parse(request.body.email);

  const settings = await new Aggregates.Settings().build();
  await settings.changeEmail(email);

  return response.status(200).send();
}
