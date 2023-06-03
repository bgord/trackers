import z from "zod";

export const TrackerValue = z.coerce.number().brand("tracker-value").default(0);
export type TrackerValueType = z.infer<typeof TrackerValue>;
