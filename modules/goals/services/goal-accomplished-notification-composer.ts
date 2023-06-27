import * as bg from "@bgord/node";

import * as VO from "../value-objects";
import * as infra from "../../../infra";

import { TrackerType } from "../../trackers/value-objects/tracker";

export class GoalAccomplishedNotificationComposer {
  private goal: Pick<VO.GoalType, "target" | "kind">;

  private tracker: Pick<TrackerType, "value" | "name">;

  constructor(
    goal: Pick<VO.GoalType, "target" | "kind">,
    tracker: Pick<TrackerType, "value" | "name">
  ) {
    this.goal = goal;
    this.tracker = tracker;
  }

  compose(): GoalAccomplishedNotificationContentType {
    const subject = bg.Schema.EmailSubject.parse(
      `You acchieved your goal for ${this.tracker?.name} tracker!`
    );

    const text = bg.Schema.EmailContentHtml.parse(
      `The ${this.goal?.kind} ${this.goal?.target} goal was achieved with ${this.tracker?.value} value.`
    );

    return { subject, text };
  }

  send(
    notification: GoalAccomplishedNotificationContentType,
    to: bg.Schema.EmailToType
  ) {
    return infra.Mailer.send({
      from: infra.Env.EMAIL_FROM,
      to,
      subject: notification.subject,
      text: notification.text,
    });
  }
}

type GoalAccomplishedNotificationContentType = {
  subject: bg.Schema.EmailSubjectType;
  text: bg.Schema.EmailContentHtmlType;
};
