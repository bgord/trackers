import express from "express";
import * as bg from "@bgord/node";
import z from "zod";

import * as infra from "../infra";

import * as Trackers from "../modules/trackers";
import * as Settings from "../modules/settings";
import * as Projects from "../modules/projects";

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

    if (error instanceof Trackers.Policies.TrackerNameIsUniqueError) {
      infra.logger.error({
        message: "Tracker name is not unique",
        operation: Trackers.Policies.TrackerNameIsUnique.message,
        correlationId: request.requestId,
      });

      return response.status(400).send({
        message: Trackers.Policies.TrackerNameIsUnique.message,
        _known: true,
      });
    }

    if (error instanceof Trackers.Policies.TrackerDatapointShouldExistError) {
      infra.logger.error({
        message: "Tracker datapoint does not exist",
        operation: Trackers.Policies.TrackerDatapointShouldExist.message,
        correlationId: request.requestId,
      });

      return response.status(400).send({
        message: Trackers.Policies.TrackerDatapointShouldExist.message,
        _known: true,
      });
    }

    if (error instanceof Trackers.Policies.TrackerValueShouldChangeError) {
      infra.logger.error({
        message: "Tracker value has not changed",
        operation: Trackers.Policies.TrackerValueShouldChange.message,
        correlationId: request.requestId,
      });

      return response.status(400).send({
        message: Trackers.Policies.TrackerValueShouldChange.message,
        _known: true,
      });
    }

    if (error instanceof Trackers.Policies.TrackerDatapointsLimitPerDayError) {
      infra.logger.error({
        message: "Tracker datapoints per day limit reached",
        operation: Trackers.Policies.TrackerDatapointsLimitPerDay.message,
        correlationId: request.requestId,
      });

      return response.status(400).send({
        message: Trackers.Policies.TrackerDatapointsLimitPerDay.message,
        _known: true,
      });
    }

    if (error instanceof Trackers.Policies.TrackerShouldHaveDatapointsError) {
      infra.logger.error({
        message: "Tracker has no datapoints",
        operation: Trackers.Policies.TrackerShouldHaveDatapoints.message,
        correlationId: request.requestId,
      });

      return response.status(400).send({
        message: Trackers.Policies.TrackerShouldHaveDatapoints.message,
        _known: true,
      });
    }

    if (error instanceof Settings.Policies.SettingsEmailShouldChangeError) {
      infra.logger.error({
        message: "Email has not changed",
        operation: Settings.Policies.SettingsEmailShouldChange.message,
        correlationId: request.requestId,
      });

      return response.status(400).send({
        message: Settings.Policies.SettingsEmailShouldChange.message,
        _known: true,
      });
    }

    if (error instanceof Settings.Policies.WeeklyTrackersReportIsEnabledError) {
      infra.logger.error({
        message: "Weekly trackers report already disabled",
        operation: Settings.Policies.WeeklyTrackersReportIsEnabled.message,
        correlationId: request.requestId,
      });

      return response.status(400).send({
        message: Settings.Policies.WeeklyTrackersReportIsEnabled.message,
        _known: true,
      });
    }

    if (
      error instanceof Settings.Policies.WeeklyTrackersReportIsDisabledError
    ) {
      infra.logger.error({
        message: "Weekly trackers report already enabled",
        operation: Settings.Policies.WeeklyTrackersReportIsDisabled.message,
        correlationId: request.requestId,
      });

      return response.status(400).send({
        message: Settings.Policies.WeeklyTrackersReportIsDisabled.message,
        _known: true,
      });
    }

    if (error instanceof Settings.Policies.SettingsEmailIsConfiguredError) {
      infra.logger.error({
        message: "Settings email is not configured",
        operation: Settings.Policies.SettingsEmailIsConfigured.message,
        correlationId: request.requestId,
      });

      return response.status(400).send({
        message: Settings.Policies.SettingsEmailIsConfigured.message,
        _known: true,
      });
    }

    if (error instanceof Trackers.Policies.TrackerNameHasChangedError) {
      infra.logger.error({
        message: "Tracker name has not changed",
        operation: Trackers.Policies.TrackerNameHasChanged.message,
        correlationId: request.requestId,
      });

      return response.status(400).send({
        message: Trackers.Policies.TrackerNameHasChanged.message,
        _known: true,
      });
    }

    if (error instanceof Trackers.Policies.TrackerShouldExistError) {
      infra.logger.error({
        message: "Tracker does not exist",
        operation: Trackers.Policies.TrackerShouldExist.message,
        correlationId: request.requestId,
      });

      return response.status(404).send({
        message: Trackers.Policies.TrackerShouldExist.message,
        _known: true,
      });
    }

    if (error instanceof Projects.Policies.ProjectNameIsUniqueError) {
      infra.logger.error({
        message: "Project name is not unique",
        operation: Projects.Policies.ProjectNameIsUnique.message,
        correlationId: request.requestId,
      });

      return response.status(404).send({
        message: Projects.Policies.ProjectNameIsUnique.message,
        _known: true,
      });
    }

    if (error instanceof z.ZodError) {
      if (
        error.issues.find(
          (issue) =>
            issue.message === Trackers.VO.TRACKER_NAME_STRUCTURE_ERROR_KEY
        )
      ) {
        return response.status(400).send({
          message: Trackers.VO.TRACKER_NAME_STRUCTURE_ERROR_KEY,
          _known: true,
        });
      }

      if (
        error.issues.find(
          (issue) => issue.message === Trackers.VO.TRACKER_KIND_ERROR_KEY
        )
      ) {
        return response.status(400).send({
          message: Trackers.VO.TRACKER_KIND_ERROR_KEY,
          _known: true,
        });
      }

      if (
        error.issues.find(
          (issue) =>
            issue.message === Trackers.VO.TRACKER_COUNTER_VALUE_ERROR_KEY
        )
      ) {
        return response.status(400).send({
          message: Trackers.VO.TRACKER_COUNTER_VALUE_ERROR_KEY,
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
