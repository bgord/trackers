import * as bg from "@bgord/node";

import * as infra from "../infra";
import * as VO from "../value-objects";

export class WeeklyTrackersReportSender {
  static send(report: VO.WeeklyTrackersReportType, to: bg.Schema.EmailToType) {
    return infra.Mailer.send({ from: infra.Env.EMAIL_FROM, ...report, to });
  }
}
