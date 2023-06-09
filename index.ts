import express from "express";
import * as bg from "@bgord/node";

import * as Routes from "./routes";
import * as infra from "./infra";

const AuthShield = new bg.EnvUserAuthShield({
  ADMIN_USERNAME: infra.Env.ADMIN_USERNAME,
  ADMIN_PASSWORD: infra.Env.ADMIN_PASSWORD,
});

const BasicAuthShield = new bg.BasicAuthShield({
  username: infra.Env.BASIC_AUTH_USERNAME,
  password: infra.Env.BASIC_AUTH_PASSWORD,
});

const Session = new bg.Session({
  secret: infra.Env.COOKIE_SECRET,
  store: bg.SessionFileStore.build({ ttl: bg.Time.Days(3).toSeconds() }),
});

const CacheResponse = new bg.CacheResponse(infra.ResponseCache);

const app = express();

bg.addExpressEssentials(app);
bg.Handlebars.applyTo(app);
bg.Language.applyTo(app, bg.Schema.Path.parse("translations"));
Session.applyTo(app);
AuthShield.applyTo(app);
bg.HttpLogger.applyTo(app, infra.logger);

app.get("/", bg.CsrfShield.attach, bg.Route(Routes.Home));
app.post(
  "/login",
  bg.CsrfShield.verify,
  AuthShield.attach,
  (_request, response) => response.redirect("/dashboard")
);
app.get("/logout", AuthShield.detach, (_, response) => response.redirect("/"));

app.get(
  "/dashboard",
  AuthShield.verify,
  bg.CacheStaticFiles.handle(bg.CacheStaticFilesStrategy.never),
  bg.Route(Routes.Dashboard)
);

app.post("/tracker", AuthShield.verify, bg.Route(Routes.TrackerCreate));
app.get("/tracker", AuthShield.verify, bg.Route(Routes.TrackerList));
app.delete(
  "/tracker/:trackerId",
  AuthShield.verify,
  bg.Route(Routes.TrackerDelete)
);
app.post(
  "/tracker/:trackerId/sync",
  AuthShield.verify,
  CacheResponse.clear,
  bg.Route(Routes.TrackerSync)
);
app.post(
  "/tracker/:trackerId/export",
  AuthShield.verify,
  // bg.RateLimitShield.build({ limitMs: bg.Time.Hours(1).toMs() }),
  bg.Route(Routes.TrackerExport)
);
app.delete(
  "/tracker/:trackerId/revert/:datapointId",
  AuthShield.verify,
  CacheResponse.clear,
  bg.Route(Routes.TrackerRevert)
);

app.get(
  "/tracker/:trackerId/datapoints",
  AuthShield.verify,
  CacheResponse.handle,
  bg.Route(Routes.TrackerDatapointList)
);

app.get(
  "/healthcheck",
  bg.RateLimitShield.build({ limitMs: bg.Time.Minutes(1).toMs() }),
  bg.Timeout.build({ timeoutMs: bg.Time.Seconds(5).toMs() }),
  BasicAuthShield.verify,
  bg.Healthcheck.build([
    new bg.Prerequisite({
      label: "self",
      strategy: bg.PrerequisiteStrategyEnum.self,
    }),
  ])
);

app.get(
  "/settings",
  AuthShield.verify,
  bg.CacheStaticFiles.handle(bg.CacheStaticFilesStrategy.never),
  bg.Route(Routes.Settings)
);

app.get("/settings/data", AuthShield.verify, bg.Route(Routes.SettingsData));
app.post(
  "/settings/weekly-trackers-report/enable",
  AuthShield.verify,
  bg.Route(Routes.SettingsWeeklyTrackersReportEnable)
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
  });
})();
