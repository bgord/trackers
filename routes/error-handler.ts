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
        operation: "tracker_sync_error_value_not_changed",
        correlationId: request.requestId,
      });

      return response.status(400).send({
        message: "tracker.sync.error.value_not_changed",
        _known: true,
      });
    }

    if (error instanceof Policies.TrackerDatapointsLimitPerDayError) {
      infra.logger.error({
        message: "Tracker datapoints per day limit reached",
        operation: "tracker_datapoints_per_day_limit_reached",
        correlationId: request.requestId,
      });

      return response.status(400).send({
        message: "tracker.sync.error.datapoints_per_daylimit_reached",
        _known: true,
      });
    }

    if (error instanceof Policies.TrackerShouldHaveDatapointsError) {
      infra.logger.error({
        message: "Tracker has no datapoints",
        operation: "tracker_has_no_datapoints",
        correlationId: request.requestId,
      });

      return response.status(400).send({
        message: "tracker.sync.error.no_datapoints",
        _known: true,
      });
    }

    if (error instanceof Policies.SettingsEmailShouldChangeError) {
      infra.logger.error({
        message: "Email has not changed",
        operation: "settings_email_has_not_changed_error",
        correlationId: request.requestId,
      });

      return response.status(400).send({
        message: "settings.email.change.error.the_same",
        _known: true,
      });
    }

    if (error instanceof Policies.WeeklyTrackersReportIsEnabledError) {
      infra.logger.error({
        message: "Weekly trackers report already enabled",
        operation: "settings.weekly_trackers_report.enable.error",
        correlationId: request.requestId,
      });

      return response.status(400).send({
        message: "settings.weekly_trackers_report.enable.error",
        _known: true,
      });
    }

    if (error instanceof Policies.WeeklyTrackersReportIsDisabledError) {
      infra.logger.error({
        message: "Weekly trackers report already disabled",
        operation: "settings.weekly_trackers_report.disable.error",
        correlationId: request.requestId,
      });

      return response.status(400).send({
        message: "settings.weekly_trackers_report.disable.error",
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
