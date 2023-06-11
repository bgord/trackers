import * as bg from "@bgord/node";
import fs from "fs/promises";
import csv from "csv";
import _path from "path";

import * as VO from "../value-objects";
import * as Repos from "../repositories";

type DatapointType = bg.AsyncReturnType<
  typeof Repos.TrackerDatapointRepository["list"]
>[0];

type TrackerDatapointsFileConfigType = {
  repository: typeof Repos.TrackerDatapointRepository;
  tracker: {
    id: VO.TrackerIdType;
    scheduledAt: bg.Schema.TimestampType;
  };
};

export class TrackerExportFile {
  private readonly config: TrackerDatapointsFileConfigType;

  private readonly TRACKER_EXPORTS_DIRECTORY = "tracker-exports";

  private readonly columns = [
    "id",
    "value",
    "createdAt",
    "date",
    "isMin",
    "isMax",
  ];

  constructor(config: TrackerDatapointsFileConfigType) {
    this.config = config;
  }

  async generate(): Promise<bg.Schema.EmailAttachmentType> {
    const datapoints = await this.config.repository.list({
      id: this.config.tracker.id,
    });

    const file = this.getPaths();
    const data = this.prepare(datapoints);

    const content = csv.stringify(data, {
      header: true,
      columns: this.columns,
    });

    await fs.writeFile(file.path, content);

    return file;
  }

  async delete() {
    const file = this.getPaths();
    await fs.unlink(file.path);
  }

  private getPaths(): bg.Schema.EmailAttachmentType {
    const filename = `${this.config.tracker.id}-${this.config.tracker.scheduledAt}.csv`;

    const path = _path.resolve(this.TRACKER_EXPORTS_DIRECTORY, filename);

    return bg.Schema.EmailAttachment.parse({ filename, path });
  }

  private prepare(datapoints: DatapointType[]) {
    return datapoints.map((datapoint) => ({
      id: datapoint.id,
      value: datapoint.value.actual,
      createdAt: datapoint.createdAt,
      date: new Date(datapoint.createdAt).toISOString(),
      isMin: datapoint.value.isMin ? 1 : 0,
      isMax: datapoint.value.isMax ? 1 : 0,
    }));
  }
}
