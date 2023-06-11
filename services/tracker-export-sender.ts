import * as bg from "@bgord/node";

import * as infra from "../infra";

type TrackerExportSenderConfigType = {
  attachment: bg.Schema.EmailAttachmentType;
  to: bg.Schema.EmailType;
  scheduledAt: bg.Schema.TimestampType;
};

export class TrackerExportSender {
  static send(config: TrackerExportSenderConfigType) {
    const date = new Date(config.scheduledAt).toUTCString();

    return infra.Mailer.send({
      from: infra.Env.EMAIL_FROM,
      to: config.to,
      subject: `Tracker export file from ${date}`,
      text: "See the attachment.",
      attachments: [config.attachment],
    });
  }
}
