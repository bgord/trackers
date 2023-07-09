import * as bg from "@bgord/node";
import fs from "fs/promises";
import csv from "csv";
import _path from "path";

import * as Trackers from "../";

type DatapointType = bg.AsyncReturnType<
  typeof Trackers.Repos.DatapointRepository["list"]
>[0];

type DatapointsFileConfigType = {
  repos: typeof Trackers.Repos;
  tracker: {
    id: Trackers.VO.TrackerIdType;
    scheduledAt: bg.Schema.TimestampType;
    name: Trackers.VO.TrackerNameType;
    timeZoneOffsetMs: bg.Schema.TimeZoneOffsetValueType;
  };
};

export class TrackerExportFile {
  private readonly config: DatapointsFileConfigType;

  static readonly TRACKER_EXPORTS_DIRECTORY = "infra/tracker-exports";

  private readonly columns = [
    "id",
    "value",
    "createdAt",
    "dateUTC",
    "isMin",
    "isMax",
  ];

  constructor(config: DatapointsFileConfigType) {
    this.config = config;
  }

  async generate(): Promise<
    bg.Schema.EmailAttachmentType & { subject: bg.Schema.EmailSubjectType }
  > {
    const datapoints = await this.config.repos.DatapointRepository.list({
      id: this.config.tracker.id,
    });

    const file = this.getPaths();
    const data = this.prepare(datapoints);

    const content = csv.stringify(data, {
      header: true,
      columns: this.columns,
    });

    await fs.writeFile(file.path, content);

    return { ...file, subject: this.getSubject() };
  }

  async delete() {
    const file = this.getPaths();
    await fs.unlink(file.path);
  }

  private getSubject(): bg.Schema.EmailSubjectType {
    const { name, scheduledAt, timeZoneOffsetMs } = this.config.tracker;

    const date = bg.TimeZoneOffset.adjustDate(scheduledAt, timeZoneOffsetMs);

    return bg.Schema.EmailSubject.parse(
      `"${name}" tracker export file from ${bg.DateFormatters.datetime(date)}`
    );
  }

  private getPaths(): bg.Schema.EmailAttachmentType {
    const filename = `${this.config.tracker.id}-${this.config.tracker.scheduledAt}.csv`;

    const path = _path.resolve(
      TrackerExportFile.TRACKER_EXPORTS_DIRECTORY,
      filename
    );

    return bg.Schema.EmailAttachment.parse({ filename, path });
  }

  private prepare(datapoints: DatapointType[]) {
    return datapoints.map((datapoint) => ({
      id: datapoint.id,
      value: datapoint.value.actual,
      createdAt: datapoint.createdAt,
      dateUTC: new Date(datapoint.createdAt).toISOString(),
      isMin: datapoint.value.isMin ? 1 : 0,
      isMax: datapoint.value.isMax ? 1 : 0,
    }));
  }
}
