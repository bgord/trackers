import { z } from "zod";
import express from "express";

import * as VO from "../value-objects";
import * as Aggregates from "../aggregates";

type Value = Record<VO.TrackerKindEnum, z.ZodSchema>;

const strategy: Value = {
  [VO.TrackerKindEnum.counter]: VO.TrackerCounterValue,
  [VO.TrackerKindEnum.one_value]: VO.TrackerValue,
};

export async function TrackerSync(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  const context = { timeZoneOffset: request.timeZoneOffset };

  const id = VO.TrackerId.parse(request.params.trackerId);
  const tracker = await new Aggregates.Tracker(id).build();

  const value = strategy[tracker.entity!.kind].parse(request.body.value);
  const comment = VO.DatapointComment.parse(request.body.comment);

  const datapoint = { value, comment };
  await tracker.sync(datapoint, context);

  return response.status(201).send();
}
