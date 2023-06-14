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
        operation: Policies.TrackerNameIsUnique.message,
        correlationId: request.requestId,
      });

      return response
        .status(400)
        .send({ message: Policies.TrackerNameIsUnique.message, _known: true });
    }

    if (error instanceof Policies.TrackerDatapointShouldExistError) {
      infra.logger.error({
        message: "Tracker datapoint does not exist",
        operation: Policies.TrackerDatapointShouldExist.message,
        correlationId: request.requestId,
      });

      return response.status(400).send({
        message: Policies.TrackerDatapointShouldExist.message,
        _known: true,
      });
    }

    if (error instanceof Policies.TrackerValueShouldChangeError) {
      infra.logger.error({
        message: "Tracker value has not changed",
        operation: Policies.TrackerValueShouldChange.message,
        correlationId: request.requestId,
      });

      return response.status(400).send({
        message: Policies.TrackerValueShouldChange.message,
        _known: true,
      });
    }

    if (error instanceof Policies.TrackerDatapointsLimitPerDayError) {
      infra.logger.error({
        message: "Tracker datapoints per day limit reached",
        operation: Policies.TrackerDatapointsLimitPerDay.message,
        correlationId: request.requestId,
      });

      return response.status(400).send({
        message: Policies.TrackerDatapointsLimitPerDay.message,
        _known: true,
      });
    }

    if (error instanceof Policies.TrackerShouldHaveDatapointsError) {
      infra.logger.error({
        message: "Tracker has no datapoints",
        operation: Policies.TrackerShouldHaveDatapoints.message,
        correlationId: request.requestId,
      });

      return response.status(400).send({
        message: Policies.TrackerShouldHaveDatapoints.message,
        _known: true,
      });
    }

    if (error instanceof Policies.SettingsEmailShouldChangeError) {
      infra.logger.error({
        message: "Email has not changed",
        operation: Policies.SettingsEmailShouldChange.message,
        correlationId: request.requestId,
      });

      return response.status(400).send({
        message: Policies.SettingsEmailShouldChange.message,
        _known: true,
      });
    }

    if (error instanceof Policies.WeeklyTrackersReportIsEnabledError) {
      infra.logger.error({
        message: "Weekly trackers report already disabled",
        operation: Policies.WeeklyTrackersReportIsEnabled.message,
        correlationId: request.requestId,
      });

      return response.status(400).send({
        message: Policies.WeeklyTrackersReportIsEnabled.message,
        _known: true,
      });
    }

    if (error instanceof Policies.WeeklyTrackersReportIsDisabledError) {
      infra.logger.error({
        message: "Weekly trackers report already enabled",
        operation: Policies.WeeklyTrackersReportIsDisabled.message,
        correlationId: request.requestId,
      });

      return response.status(400).send({
        message: Policies.WeeklyTrackersReportIsDisabled.message,
        _known: true,
      });
    }

    if (error instanceof Policies.SettingsEmailIsConfiguredError) {
      infra.logger.error({
        message: "Settings email is not configured",
        operation: Policies.SettingsEmailIsConfigured.message,
        correlationId: request.requestId,
      });

      return response.status(400).send({
        message: Policies.SettingsEmailIsConfigured.message,
        _known: true,
      });
    }

    if (error instanceof Policies.TrackerNameHasChangedError) {
      infra.logger.error({
        message: "Tracker name has not changed",
        operation: Policies.TrackerNameHasChanged.message,
        correlationId: request.requestId,
      });

      return response.status(400).send({
        message: Policies.TrackerNameHasChanged.message,
        _known: true,
      });
    }

    if (error instanceof Policies.TrackerShouldExistError) {
      infra.logger.error({
        message: "Tracker does not exist",
        operation: Policies.TrackerShouldExist.message,
        correlationId: request.requestId,
      });

      return response.status(404).send({
        message: Policies.TrackerShouldExist.message,
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
      metadata: infra.logger.formatError(error),
    });

    return next(error);
  };
}
