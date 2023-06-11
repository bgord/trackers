import * as bg from "@bgord/node";
import format from "date-fns/format";

import * as VO from "../value-objects";
import * as Repos from "../repositories";

type DatapointType = bg.AsyncReturnType<
  typeof Repos.TrackerDatapointRepository["listFromRange"]
>[0];

type WeeklyTrackersReportGeneratorConfigType = {
  scheduledAt: bg.Schema.TimestampType;
  repos: {
    tracker: typeof Repos.TrackerRepository;
    datapoint: typeof Repos.TrackerDatapointRepository;
  };
};

export class WeeklyTrackersReportGenerator {
  private readonly config: WeeklyTrackersReportGeneratorConfigType;

  private readonly range: {
    from: bg.Schema.TimestampType;
    to: bg.Schema.TimestampType;
  };

  private trackers: VO.TrackerType[];

  constructor(config: WeeklyTrackersReportGeneratorConfigType) {
    this.config = config;
    this.range = this.getDateRange();

    this.trackers = [];
  }

  async generate(): Promise<VO.WeeklyTrackersReportType> {
    await this.getTrackers();

    let report = this.createHeader();
    report += this.addNewLine(2);

    for (const tracker of this.trackers) {
      report += this.createTrackerRow(tracker);
      report += this.addNewLine(2);

      const datapoints = await this.config.repos.datapoint.listFromRange({
        id: tracker.id,
        ...this.range,
      });

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
    const from = format(this.range.from, "yyyy-MM-dd");
    const to = format(this.range.to, "yyyy-MM-dd");

    return `Weekly trackers report ${from} - ${to}`;
  }

  private createHeader() {
    const from = format(this.range.from, "yyyy-MM-dd");
    const to = format(this.range.to, "yyyy-MM-dd");

    return `<strong>Weekly trackers report ${from} - ${to}</strong>`;
  }

  private addNewLine(count = 1) {
    return "<br />".repeat(count);
  }

  private createTrackerRow(tracker: VO.TrackerType) {
    return `<strong>${tracker.name}</strong> tracker (${tracker.kind}), current value: <strong>${tracker.value}</strong>`;
  }

  private createTrackerDatapointCountRow(datapoints: DatapointType[]) {
    return `<strong>${datapoints.length}</strong> new datapoints`;
  }

  private createTrackerDatapointRow(datapoint: DatapointType) {
    return `- <strong>${
      datapoint.value.actual
    }</strong> (${bg.DateFormatters.datetime(datapoint.createdAt)})`;
  }

  private async getTrackers() {
    this.trackers = await this.config.repos.tracker.list();
  }

  private getDateRange() {
    return {
      from: this.config.scheduledAt - bg.Time.Days(7).toMs(),
      to: this.config.scheduledAt,
    };
  }
}
