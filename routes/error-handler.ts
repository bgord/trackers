import express from "express";
import * as bg from "@bgord/node";
import z from "zod";

import * as VO from "../value-objects";
import * as Policies from "../policies";
import * as infra from "../infra";

export class ErrorHandler {
  /* eslint-disable max-params */
  static handle: express.ErrorRequestHandler = async (
    error,
    request,
    response,
    next
  ) => {
    if (error instanceof bg.Errors.InvalidCredentialsError) {
      infra.logger.error({
        message: "Invalid credentials",
        operation: "invalid_credentials_error",
        correlationId: request.requestId,
      });
      return response.redirect("/");
    }

    if (error instanceof bg.Errors.AccessDeniedError) {
      infra.logger.error({
        message: "Access denied",
        operation: "access_denied_error",
        correlationId: request.requestId,
      });
      return response.redirect("/");
    }

    if (error instanceof bg.Errors.FileNotFoundError) {
      infra.logger.error({
        message: "File not found",
        operation: "file_not_found_error",
        correlationId: request.requestId,
      });

      return response.status(404).send("File not found");
    }

    if (error instanceof bg.Errors.TooManyRequestsError) {
      infra.logger.error({
        message: "Too many requests",
        operation: "too_many_requests",
        correlationId: request.requestId,
        metadata: { remainingMs: error.remainingMs },
      });

      return response
        .status(429)
        .send({ message: "app.too_many_requests", _known: true });
    }

    if (error instanceof bg.Errors.RequestTimeoutError) {
      infra.logger.error({
        message: "Request timeout error",
        operation: "request_timeout_error",
        correlationId: request.requestId,
        metadata: { timeoutMs: error.timeoutMs },
      });

      return response
        .status(408)
        .send({ message: "request_timeout_error", _known: true });
    }

    if (error instanceof Policies.TrackerNameIsUniqueError) {
      infra.logger.error({
        message: "Tracker name is not unique",
        operation: VO.TRACKER_NAME_UNIQUE_ERROR_KEY,
        correlationId: request.requestId,
      });

      return response
        .status(400)
        .send({ message: VO.TRACKER_NAME_UNIQUE_ERROR_KEY, _known: true });
    }

    if (error instanceof Policies.TrackerValueShouldChangeError) {
      infra.logger.error({
        message: "Tracker value has not changed",
        operation: "tracker_value_sync_error_value_not_changed",
        correlationId: request.requestId,
      });

      return response.status(400).send({
        message: "tracker.value.sync.error.value_not_changed",
        _known: true,
      });
    }

    if (error instanceof z.ZodError) {
      if (
        error.issues.find(
          (issue) => issue.message === VO.TRACKER_NAME_STRUCTURE_ERROR_KEY
        )
      ) {
        return response.status(400).send({
          message: VO.TRACKER_NAME_STRUCTURE_ERROR_KEY,
          _known: true,
        });
      }

      if (
        error.issues.find(
          (issue) => issue.message === VO.TRACKER_KIND_ERROR_KEY
        )
      ) {
        return response.status(400).send({
          message: VO.TRACKER_KIND_ERROR_KEY,
          _known: true,
        });
      }
    }

    infra.logger.error({
      message: "Unknown error",
      operation: "unknown_error",
      correlationId: request.requestId,
      metadata: {
        message: (error as Error)?.message,
        name: (error as Error)?.name,
        stack: (error as Error)?.stack,
      },
    });

    return next(error);
  };
}
