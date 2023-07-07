import * as bg from "@bgord/node";

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

  static async pagedList(
    where: Pick<VO.HistoryType, "relatedTrackerId">,
    pagination: bg.PaginationType
  ) {
    const [total, histories] = await infra.db.$transaction([
      infra.db.history.count({ where }),
      infra.db.history.findMany({
        where,
        orderBy: { createdAt: "desc" },
        ...pagination.values,
      }),
    ]);

    const result = histories.map((item) => ({
      ...item,
      payload: item.payload ? JSON.parse(item.payload) : {},
      createdAt: bg.RelativeDate.to.now.truthy(item.createdAt),
    }));

    return bg.Pagination.prepare({ total, pagination, result });
  }

  static async clear(where: Pick<VO.HistoryType, "relatedTrackerId">) {
    await infra.db.history.deleteMany({ where });
  }
}
