import express from "express";
import * as bg from "@bgord/node";
import z from "zod";
import { logger } from "./logger";

import * as VO from "./value-objects";

export class ErrorHandler {
  /* eslint-disable max-params */
  static handle: express.ErrorRequestHandler = async (
    error,
    request,
    response,
    next
  ) => {
    if (error instanceof bg.Errors.InvalidCredentialsError) {
      logger.error({
        message: "Invalid credentials",
        operation: "invalid_credentials_error",
        correlationId: request.requestId,
      });
      return response.redirect("/");
    }

    if (error instanceof bg.Errors.AccessDeniedError) {
      logger.error({
        message: "Access denied",
        operation: "access_denied_error",
        correlationId: request.requestId,
      });
      return response.redirect("/");
    }

    if (error instanceof bg.Errors.FileNotFoundError) {
      logger.error({
        message: "File not found",
        operation: "file_not_found_error",
        correlationId: request.requestId,
      });

      return response.status(404).send("File not found");
    }

    if (error instanceof bg.Errors.TooManyRequestsError) {
      logger.error({
        message: "Too many requests",
        operation: "too_many_requests",
        correlationId: request.requestId,
        metadata: { remainingMs: error.remainingMs },
      });

      return response
        .status(429)
        .send({ message: "app.too_many_requests", _known: true });
    }

    if (error instanceof z.ZodError) {
      if (
        error.issues.find(
          (issue) => issue.message === VO.TRACKER_NAME_ERROR_KEY
        )
      ) {
        return response.status(400).send({
          message: VO.TRACKER_NAME_ERROR_KEY,
          _known: true,
        });
      }
    }

    logger.error({
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
