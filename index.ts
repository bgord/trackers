import express from "express";
import * as bg from "@bgord/node";

import * as Routes from "./routes";

import { ErrorHandler } from "./error-handler";
import { Env } from "./env";
import { logger } from "./logger";

const AuthShield = new bg.EnvUserAuthShield({
  ADMIN_USERNAME: Env.ADMIN_USERNAME,
  ADMIN_PASSWORD: Env.ADMIN_PASSWORD,
});

const BasicAuthShield = new bg.BasicAuthShield({
  username: Env.BASIC_AUTH_USERNAME,
  password: Env.BASIC_AUTH_PASSWORD,
});

const Session = new bg.Session({
  secret: Env.COOKIE_SECRET,
  store: bg.SessionFileStore.build({ ttl: bg.Time.Days(3).toSeconds() }),
});

const app = express();

bg.addExpressEssentials(app);
bg.Handlebars.applyTo(app);
bg.Language.applyTo(app, bg.Schema.Path.parse("translations"));
Session.applyTo(app);
AuthShield.applyTo(app);
bg.HttpLogger.applyTo(app, logger);

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
app.post(
  "/tracker/:trackerId/sync",
  AuthShield.verify,
  bg.Route(Routes.TrackerSync)
);

app.get(
  "/healthcheck",
  bg.Timeout.build({ timeoutMs: bg.Time.Seconds(2).toMs() }),
  BasicAuthShield.verify,
  bg.Healthcheck.build([
    new bg.Prerequisite({
      label: "self",
      strategy: bg.PrerequisiteStrategyEnum.self,
    }),
  ])
);

app.get("*", (_, response) => response.redirect("/"));
app.use(ErrorHandler.handle);

(async function main() {
  await bg.GracefulStartup.check({
    port: Env.PORT,
    callback: () => {
      logger.error({
        message: "Busy port",
        operation: "server_startup_error",
        metadata: { port: Env.PORT },
      });

      process.exit(1);
    },
  });

  const server = app.listen(Env.PORT, async () => {
    logger.info({
      message: "Server has started",
      operation: "server_startup",
      metadata: { port: Env.PORT },
    });
  });

  bg.GracefulShutdown.applyTo(server, () => {
    logger.info({
      message: "Shutting down job scheduler",
      operation: "scheduler_shutdown",
    });
  });
})();
