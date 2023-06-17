import express from "express";
import * as bg from "@bgord/node";

import * as Routes from "./routes";
import * as infra from "./infra";

import * as Trackers from "./modules/trackers";
import * as Settings from "./modules/settings";
import * as Projects from "./modules/projects";

const app = express();

bg.addExpressEssentials(app);
bg.Handlebars.applyTo(app);
bg.I18n.applyTo(app);
infra.Session.applyTo(app);
infra.AuthShield.applyTo(app);
bg.HttpLogger.applyTo(app, infra.logger);

app.get("/", bg.CsrfShield.attach, bg.Route(Routes.Home));
app.post(
  "/login",
  bg.CsrfShield.verify,
  infra.AuthShield.attach,
  (_request, response) => response.redirect("/dashboard")
);
app.get("/logout", infra.AuthShield.detach, (_, response) =>
  response.redirect("/")
);

app.get(
  "/dashboard",
  infra.AuthShield.verify,
  bg.CacheStaticFiles.handle(bg.CacheStaticFilesStrategy.never),
  bg.Route(Routes.Dashboard)
);

app.post(
  "/tracker",
  infra.AuthShield.verify,
  bg.Route(Trackers.Routes.TrackerCreate)
);
app.get(
  "/tracker",
  infra.AuthShield.verify,
  bg.Route(Trackers.Routes.TrackerList)
);
app.delete(
  "/tracker/:trackerId",
  infra.AuthShield.verify,
  infra.CacheResponse.clear,
  bg.Route(Trackers.Routes.TrackerDelete)
);
app.post(
  "/tracker/:trackerId/sync",
  infra.AuthShield.verify,
  infra.CacheResponse.clear,
  bg.Route(Trackers.Routes.TrackerSync)
);
app.post(
  "/tracker/:trackerId/export",
  infra.AuthShield.verify,
  bg.RateLimitShield.build({ limitMs: bg.Time.Hours(1).toMs() }),
  bg.Route(Trackers.Routes.TrackerExport)
);
app.post(
  "/tracker/:trackerId/name",
  infra.AuthShield.verify,
  bg.Route(Trackers.Routes.TrackerNameChange)
);
app.delete(
  "/tracker/:trackerId/revert/:datapointId",
  infra.AuthShield.verify,
  infra.CacheResponse.clear,
  bg.Route(Trackers.Routes.TrackerRevert)
);

app.get(
  "/tracker/:trackerId/datapoints",
  infra.AuthShield.verify,
  infra.CacheResponse.handle,
  bg.Route(Trackers.Routes.TrackerDatapointList)
);

app.get(
  "/settings",
  infra.AuthShield.verify,
  bg.CacheStaticFiles.handle(bg.CacheStaticFilesStrategy.never),
  bg.Route(Settings.Routes.Settings)
);

app.get(
  "/settings/data",
  infra.AuthShield.verify,
  bg.Route(Settings.Routes.SettingsData)
);
app.post(
  "/settings/weekly-trackers-report/enable",
  infra.AuthShield.verify,
  bg.Route(Settings.Routes.SettingsWeeklyTrackersReportEnable)
);
app.post(
  "/settings/weekly-trackers-report/disable",
  infra.AuthShield.verify,
  bg.Route(Settings.Routes.SettingsWeeklyTrackersReportDisable)
);

app.post(
  "/settings/email/change",
  infra.AuthShield.verify,
  bg.Route(Settings.Routes.SettingsEmailChange)
);

app.delete(
  "/settings/email",
  infra.AuthShield.verify,
  bg.Route(Settings.Routes.SettingsEmailDelete)
);

app.get(
  "/healthcheck",
  bg.RateLimitShield.build({ limitMs: bg.Time.Minutes(1).toMs() }),
  bg.Timeout.build({ timeoutMs: bg.Time.Seconds(5).toMs() }),
  infra.BasicAuthShield.verify,
  bg.Healthcheck.build(infra.healthcheck)
);

app.post(
  "/project",
  infra.AuthShield.verify,
  bg.Route(Projects.Routes.ProjectCreate)
);

app.get(
  "/projects",
  infra.AuthShield.verify,
  bg.Route(Projects.Routes.ProjectList)
);

app.get("*", (_, response) => response.redirect("/"));
app.use(Routes.ErrorHandler.handle);

(async function main() {
  await bg.GracefulStartup.check({
    port: infra.Env.PORT,
    callback: () => {
      infra.logger.error({
        message: "Busy port",
        operation: "server_startup_error",
        metadata: { port: infra.Env.PORT },
      });

      process.exit(1);
    },
  });

  await bg.Prerequisites.check(infra.prerequisites);

  const server = app.listen(infra.Env.PORT, async () => {
    infra.logger.info({
      message: "Server has started",
      operation: "server_startup",
      metadata: { port: infra.Env.PORT },
    });
  });

  bg.GracefulShutdown.applyTo(server, () => {
    infra.logger.info({
      message: "Shutting down job scheduler",
      operation: "scheduler_shutdown",
    });

    infra.jobs.WeeklyTrackersReportSchedulerJob.stop();
  });
})();
