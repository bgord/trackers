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
    const trackers = await this.config.repos.tracker.list();

    let report = this.createHeader();
    report += this.addNewLine(2);

    for (const tracker of trackers) {
      report += this.createTrackerRow(tracker);
      report += this.addNewLine(2);

      const datapoints = (await this.config.repos.datapoint.listFromRange({
        id: tracker.id,
        ...this.range,
      })) as VO.TrackerDatapointType[];

      report += this.createTrackerDatapointCountRow(datapoints);
      report += this.addNewLine(2);

      for (const datapoint of datapoints) {
        report += this.createTrackerDatapointRow(datapoint);
        report += this.addNewLine();
      }
    }

    return { html: report, subject: this.createSubject() };
  }

  private createSubject() {
    const from = bg.DateFormatters.date(this.range.from);
    const to = bg.DateFormatters.date(this.range.to);

    return `Weekly trackers report ${from} - ${to}`;
  }

  private createHeader() {
    return `<strong>${this.createSubject()}</strong>`;
  }

  private addNewLine(count = 1) {
    return "<br />".repeat(count);
  }

  private createTrackerRow(tracker: VO.TrackerType) {
    const { name, kind, value } = tracker;

    return `<strong>${name}</strong> tracker (${kind}), current value: <strong>${value}</strong>`;
  }

  private createTrackerDatapointCountRow(
    datapoints: VO.TrackerDatapointType[]
  ) {
    return `<strong>${datapoints.length}</strong> new datapoints`;
  }

  private createTrackerDatapointRow(datapoint: VO.TrackerDatapointType) {
    const value = datapoint.value;
    const createdAt = bg.DateFormatters.datetime(datapoint.createdAt);

    return `- <strong>${value}</strong> (${createdAt})`;
  }
}
