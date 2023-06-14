import * as bg from "@bgord/node";

import * as VO from "../value-objects";

export class SettingsEmailIsConfiguredError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, SettingsEmailIsConfiguredError.prototype);
  }
}

type SettingsEmailIsConfiguredConfigType = {
  email: VO.SettingsType["email"];
};

class SettingsEmailIsConfiguredFactory extends bg.Policy<SettingsEmailIsConfiguredConfigType> {
  async fails(config: SettingsEmailIsConfiguredConfigType): Promise<boolean> {
    return !config.email;
  }

  message = "settings.email.error.not_configured";

  error = SettingsEmailIsConfiguredError;
}

export const SettingsEmailIsConfigured = new SettingsEmailIsConfiguredFactory();
