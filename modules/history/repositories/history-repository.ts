import * as VO from "../value-objects";

import * as infra from "../../../infra";

type HistoryPayloadType = Pick<
  VO.HistoryType,
  "createdAt" | "relatedTrackerId" | "operation"
> & { payload: Record<string, any> };

export class HistoryRepository {
  static async append(payload: HistoryPayloadType) {
    const data = VO.History.parse(payload);

    await infra.db.history.create({ data });
  }
}
