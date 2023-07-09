import * as bg from "@bgord/node";
import fs from "fs/promises";
import csv from "csv";
import _path from "path";

import * as Trackers from "../";
import * as Goals from "../../goals";

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
    "achievedGoal",
    "goalTarget",
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

    const goal = await this.config.repos.TrackerRepository.getGoalForTracker({
      id: this.config.tracker.id,
    });

    const file = this.getPaths();
    const data = this.prepare(datapoints, goal as Goals.VO.GoalType | null);

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

  private prepare(datapoints: DatapointType[], goal: Goals.VO.GoalType | null) {
    const result = datapoints.map((datapoint) => ({
      id: datapoint.id,
      value: datapoint.value.actual,
      createdAt: datapoint.createdAt,
      dateUTC: new Date(datapoint.createdAt).toISOString(),
      isMin: datapoint.value.isMin ? 1 : 0,
      isMax: datapoint.value.isMax ? 1 : 0,
      achievedGoal: 0,
      goalTarget: "no",
    }));

    if (!goal) return result;

    const verifier = new Goals.Services.GoalVerifier(goal);

    return result.map((row) => ({
      ...row,
      achievedGoal: Number(
        verifier.verify(row.value as Trackers.VO.TrackerValueType)
      ),
      goalTarget: goal.target,
    }));
  }
}
