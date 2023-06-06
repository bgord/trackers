import * as bg from "@bgord/node";
import { z } from "zod";

const EnvironmentSchema = z.object({
  PORT: bg.Schema.Port,
  ADMIN_USERNAME: bg.Schema.AdminUsername,
  ADMIN_PASSWORD: bg.Schema.AdminPassword,
  COOKIE_SECRET: bg.Schema.CookieSecret,
  LOGS_LEVEL: bg.Schema.LogLevel,
  BASIC_AUTH_USERNAME: bg.Schema.BasicAuthUsername,
  BASIC_AUTH_PASSWORD: bg.Schema.BasicAuthPassword,
});
type EnvironmentSchemaType = z.infer<typeof EnvironmentSchema>;

export const Env = new bg.EnvironmentValidator<EnvironmentSchemaType>({
  type: process.env.NODE_ENV,
  schema: EnvironmentSchema,
}).load();
