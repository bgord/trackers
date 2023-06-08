import * as bg from "@bgord/node";

import * as infra from "../infra";

type TrackerExportSenderConfigType = {
  filename: bg.Schema.PathType;
  email: bg.Schema.EmailType;
  scheduledAt: bg.Schema.TimestampType;
};

export class TrackerExportSender {
  static send(config: TrackerExportSenderConfigType) {
    const date = new Date(config.scheduledAt).toUTCString();

    return infra.Mailer.send({
      from: infra.Env.EMAIL_FROM,
      to: config.email,
      subject: `Tracker export file from ${date}`,
      text: "See the attachment.",
      attachments: [{ filename: config.filename, path: config.filename }],
    });
  }
}
