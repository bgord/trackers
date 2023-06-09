import * as bg from "@bgord/node";
import fs from "fs/promises";
import csv from "csv";

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

export class TrackerDatapointsFile {
  private readonly config: TrackerDatapointsFileConfigType;

  private datapoints: DatapointType[];

  columns = ["id", "value", "createdAt", "date", "isMin", "isMax"];

  constructor(config: TrackerDatapointsFileConfigType) {
    this.config = config;
    this.datapoints = [];
  }

  async generate(): Promise<bg.Schema.PathType> {
    await this.fetchDatapoints();

    const filename = this.createFilename();
    const data = this.prepare(this.datapoints);

    const content = csv.stringify(data, {
      header: true,
      columns: this.columns,
    });

    await fs.writeFile(filename, content);

    return filename;
  }

  private async fetchDatapoints() {
    this.datapoints = await this.config.repository.list({ id: this.config.id });
  }

  private createFilename(): bg.Schema.PathType {
    const filename = `${this.config.id}-${this.config.scheduledAt}.csv`;

    return bg.Schema.Path.parse(filename);
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
