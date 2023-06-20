import * as bg from "@bgord/node";

import * as VO from "../value-objects";

export class Task {
  id: VO.TaskIdType;

  stream: bg.EventType["stream"];

  entity: VO.TaskType | null = null;

  constructor(id: VO.TaskIdType) {
    this.id = id;
    this.stream = Task.getStream(id);
  }

  static getStream(id: VO.TaskIdType) {
    return `task_${id}`;
  }
}
