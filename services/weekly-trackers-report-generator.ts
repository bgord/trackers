import * as bg from "@bgord/node";

import * as VO from "../value-objects";
import * as Repos from "../repositories";

type WeeklyTrackersReportGeneratorConfigType = {
  scheduledAt: bg.Schema.TimestampType;
  repository: typeof Repos.TrackerRepository;
};

export class WeeklyTrackersReportGenerator {
  private readonly config: WeeklyTrackersReportGeneratorConfigType;

  private trackers: VO.TrackerType[];

  constructor(config: WeeklyTrackersReportGeneratorConfigType) {
    this.config = config;

    this.trackers = [];
  }

  async generate() {
    console.log(this.config);

    await this.getTrackers();

    console.log(this.trackers);
  }

  private async getTrackers() {
    const trackers = await this.config.repository.list();

    this.trackers = trackers;
  }
}
