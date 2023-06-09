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
  id: VO.TrackerIdType;
  scheduledAt: bg.Schema.TimestampType;
  repository: typeof Repos.TrackerDatapointRepository;
};

export type TrackerExportAttachment = {
  filename: bg.Schema.PathType;
  path: bg.Schema.PathType;
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

  private datapoints: DatapointType[];

  constructor(config: TrackerDatapointsFileConfigType) {
    this.config = config;
    this.datapoints = [];
  }

  async generate(): Promise<TrackerExportAttachment> {
    await this.fetchDatapoints();

    const file = this.getPaths();
    const data = this.prepare(this.datapoints);

    const content = csv.stringify(data, {
      header: true,
      columns: this.columns,
    });

    await fs.writeFile(file.path, content);

    return file;
  }

  private async fetchDatapoints() {
    this.datapoints = await this.config.repository.list({ id: this.config.id });
  }

  private getPaths(): TrackerExportAttachment {
    const filename = bg.Schema.Path.parse(
      `${this.config.id}-${this.config.scheduledAt}.csv`
    );

    const path = bg.Schema.Path.parse(
      _path.resolve(this.TRACKER_EXPORTS_DIRECTORY, filename)
    );

    return { filename, path };
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
