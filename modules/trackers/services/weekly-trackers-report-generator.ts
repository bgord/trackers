import * as bg from "@bgord/node";

import * as VO from "../value-objects";
import * as Repos from "../repositories";

type WeeklyTrackersReportGeneratorConfigType = {
  repos: {
    tracker: typeof Repos.TrackerRepository;
    datapoint: typeof Repos.TrackerDatapointRepository;
  };
  scheduledAt: bg.Schema.TimestampType;
};

type ReportContentType = string;

export enum ReportTypeEnum {
  text = "text",
  html = "html",
}

export class Report {
  content: ReportContentType;

  type: ReportTypeEnum;

  constructor(type: ReportTypeEnum) {
    this.content = "";
    this.type = type;
  }

  addNewLine(count = 1) {
    if (this.type === ReportTypeEnum.text) {
      this.content += "\n".repeat(count);
    }

    if (this.type === ReportTypeEnum.html) {
      this.content += "<br />".repeat(count);
    }
  }

  append(text: ReportContentType) {
    this.content += text;
  }
}

export class WeeklyTrackersReportGenerator {
  private readonly config: WeeklyTrackersReportGeneratorConfigType;

  private readonly range: {
    from: bg.Schema.TimestampType;
    to: bg.Schema.TimestampType;
  };

  constructor(config: WeeklyTrackersReportGeneratorConfigType) {
    this.config = config;

    this.range = {
      from: this.config.scheduledAt - bg.Time.Days(7).toMs(),
      to: this.config.scheduledAt,
    };
  }

  async generate(): Promise<VO.WeeklyTrackersReportType> {
    const report = new Report(ReportTypeEnum.html);

    report.append(this.createHeader());
    report.addNewLine(2);

    const trackers = await this.config.repos.tracker.listActive();

    for (const tracker of trackers) {
      report.append(this.createTrackerRow(tracker));
      report.addNewLine(2);

      const datapoints = (await this.config.repos.datapoint.listFromRange({
        id: tracker.id,
        ...this.range,
      })) as VO.DatapointType[];

      report.append(this.createTrackerDatapointCountRow(datapoints));
      report.addNewLine(2);

      for (const datapoint of datapoints) {
        report.append(this.createTrackerDatapointRow(datapoint));
        report.addNewLine();
      }
    }

    return { html: report.content, subject: this.createSubject() };
  }

  private createSubject() {
    const from = bg.DateFormatters.date(this.range.from);
    const to = bg.DateFormatters.date(this.range.to);

    return `Weekly trackers report ${from} - ${to}`;
  }

  private createHeader() {
    return `<strong>${this.createSubject()}</strong>`;
  }

  private createTrackerRow(tracker: VO.TrackerType) {
    const { name, kind, value } = tracker;

    return `<strong>${name}</strong> tracker (${kind}), current value: <strong>${value}</strong>`;
  }

  private createTrackerDatapointCountRow(datapoints: VO.DatapointType[]) {
    return `<strong>${datapoints.length}</strong> new datapoints`;
  }

  private createTrackerDatapointRow(datapoint: VO.DatapointType) {
    const value = datapoint.value;
    const createdAt = bg.DateFormatters.datetime(datapoint.createdAt);

    return `- <strong>${value}</strong> (${createdAt})`;
  }
}
