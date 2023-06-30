import * as VO from "../value-objects";
import * as Repos from "../repositories";
import * as Policies from "../policies";
import * as Events from "../events";

import * as infra from "../../../infra";

export class DatapointComment {
  private id: VO.DatapointIdType;

  private comment: VO.DatapointCommentType;

  constructor(id: VO.DatapointIdType) {
    this.id = id;
  }

  async build() {
    const datapoint = await Repos.DatapointRepository.getDatapoint(this.id);

    if (!datapoint) throw new Policies.DatapointShouldExistError();

    this.comment = VO.DatapointComment.parse(datapoint.comment ?? undefined);

    return this;
  }

  async delete() {
    await infra.EventStore.save(
      Events.DatapointCommentDeletedEvent.parse({
        name: Events.DATAPOINT_COMMENT_DELETED_EVENT,
        stream: `datapoint_${this.id}`,
        version: 1,
        payload: { datapointId: this.id },
      })
    );
  }
}
