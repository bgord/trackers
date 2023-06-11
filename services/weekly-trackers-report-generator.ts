import * as bg from "@bgord/node";
import format from "date-fns/format";

import * as VO from "../value-objects";
import * as Repos from "../repositories";

type DatapointType = bg.AsyncReturnType<
  typeof Repos.TrackerDatapointRepository["list"]
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
    this.range = this.getDateRange(config);

    this.trackers = [];
  }

  async generate() {
    await this.getTrackers();

    let report = this.createHeader();
    report += this.addNewLine(2);

    for (const tracker of this.trackers) {
      report += this.createTrackerRow(tracker);

      const datapoints = await this.config.repos.datapoint.list({
        id: tracker.id,
      });

      for (const datapoint of datapoints) {
        report += this.createTrackerDatapointRow(datapoint);
      }
    }

    return report;
  }

  private createHeader() {
    return "<strong>Weekly trackers report</strong>";
  }

  private addNewLine(count = 1) {
    return "<br />".repeat(count);
  }

  private createTrackerRow(tracker: VO.TrackerType) {
    return `\nTracker: ${tracker.name} [${tracker.kind}], current value: ${tracker.value}\n`;
  }

  private createTrackerDatapointRow(datapoint: DatapointType) {
    return `- ${datapoint.value.actual} (${datapoint.createdAt})\n`;
  }

  private async getTrackers() {
    this.trackers = await this.config.repos.tracker.list();
  }

  private getDateRange(config: WeeklyTrackersReportGeneratorConfigType) {
    return {
      from: config.scheduledAt - bg.Time.Days(7).toMs(),
      to: config.scheduledAt,
    };
  }
}
