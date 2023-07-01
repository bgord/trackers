export * from "./db";
export * from "./env";
export * from "./html";
export * from "./mailer";
export * from "./logger";
export * from "./response-cache";
export * from "./jobs";

export * from "./event-store";
import { TrackerExportFile } from "../modules/trackers/services/tracker-export-file";

import * as bg from "@bgord/node";
import { Env } from "./env";
import { ResponseCache } from "./response-cache";
import { Mailer } from "./mailer";
import { db } from "./db";

export const AuthShield = new bg.EnvUserAuthShield({
  ADMIN_USERNAME: Env.ADMIN_USERNAME,
  ADMIN_PASSWORD: Env.ADMIN_PASSWORD,
});

export const BasicAuthShield = new bg.BasicAuthShield({
  username: Env.BASIC_AUTH_USERNAME,
  password: Env.BASIC_AUTH_PASSWORD,
});

export const Session = new bg.Session({
  secret: Env.COOKIE_SECRET,
  store: bg.SessionFileStore.build({ ttl: bg.Time.Days(3).toSeconds() }),
});

export const CacheResponse = new bg.CacheResponse(ResponseCache);

export const prerequisites = [
  new bg.Prerequisite({
    label: "timezone",
    strategy: bg.PrerequisiteStrategyEnum.timezoneUTC,
    timezone: Env.TZ,
  }),

  new bg.Prerequisite({
    label: "nodemailer",
    strategy: bg.PrerequisiteStrategyEnum.mailer,
    mailer: Mailer,
  }),

  new bg.Prerequisite({
    label: "tracker-exports directory",
    strategy: bg.PrerequisiteStrategyEnum.path,
    path: TrackerExportFile.TRACKER_EXPORTS_DIRECTORY,
    access: { write: true },
  }),

  new bg.Prerequisite({
    label: "prisma-sqlite",
    strategy: bg.PrerequisiteStrategyEnum.prisma,
    client: db,
  }),
];

export const healthcheck = [
  new bg.Prerequisite({
    label: "self",
    strategy: bg.PrerequisiteStrategyEnum.self,
  }),
  ...prerequisites,
];
