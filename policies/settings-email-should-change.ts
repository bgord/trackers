import * as bg from "@bgord/node";

import * as VO from "../value-objects";

export class SettingsEmailShouldChangeError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, SettingsEmailShouldChangeError.prototype);
  }
}

type SettingsEmailShouldChangeConfigType = {
  current: VO.SettingsType["email"];
  changed: VO.SettingsEmailType;
};

class SettingsEmailShouldChangeFactory extends bg.Policy<SettingsEmailShouldChangeConfigType> {
  async fails(config: SettingsEmailShouldChangeConfigType): Promise<boolean> {
    return config.current === config.changed;
  }

  error = SettingsEmailShouldChangeError;
}

export const SettingsEmailShouldChange = new SettingsEmailShouldChangeFactory();
