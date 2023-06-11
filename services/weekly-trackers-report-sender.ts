import * as infra from "../infra";
import * as VO from "../value-objects";

type TrackerExportSenderConfigType = VO.WeeklyTrackersReportType;

export class WeeklyTrackersReportSender {
  static send(config: TrackerExportSenderConfigType) {
    return infra.Mailer.send({
      from: infra.Env.EMAIL_FROM,
      to: "joe@example.com",
      ...config,
    });
  }
}
