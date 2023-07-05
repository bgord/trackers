import express from "express";

import * as Repos from "../repositories";
import * as VO from "../value-objects";

export async function HistoryList(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  const relatedTrackerId = VO.HistoryRelatedTrackerId.parse(
    request.params.relatedTrackerId
  );
  const history = await Repos.HistoryRepository.list({ relatedTrackerId });

  return response.status(200).send(history);
}
