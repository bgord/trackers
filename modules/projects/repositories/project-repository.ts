import _ from "lodash";

import * as infra from "../../../infra";
import * as VO from "../value-objects";

export class TrackerRepository {
  static async create(payload: VO.ProjectType) {
    return infra.db.project.create({
      data: { ...payload, updatedAt: payload.createdAt },
    });
  }
}
