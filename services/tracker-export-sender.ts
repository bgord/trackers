import * as bg from "@bgord/node";

import * as infra from "../infra";
import * as Services from "../services";

type TrackerExportSenderConfigType = {
  attachment: Services.TrackerExportAttachment;
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
      attachments: [config.attachment],
    });
  }
}
