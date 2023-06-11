import * as infra from "../infra";

type TrackerExportSenderConfigType = {
  content: string;
};

export class WeeklyTrackersReportSender {
  static send(config: TrackerExportSenderConfigType) {
    return infra.Mailer.send({
      from: infra.Env.EMAIL_FROM,
      to: "joe@example.com",
      subject: `Weekly trackers report`,
      html: config.content,
    });
  }
}
