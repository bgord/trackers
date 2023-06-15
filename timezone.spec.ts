import * as bg from "@bgord/node";
import { it, expect, describe } from "vitest";

function getStartOfDayInTzTimestamp(now: number, timeZoneOffsetMs: number) {
  const startOfDayUTC = new Date();
  startOfDayUTC.setUTCHours(0, 0, 0, 0);

  const startOfDayInTimeZone = startOfDayUTC.getTime() + timeZoneOffsetMs;

  const timeSinceStartOfDayInTimeZoneRelativeToUtcStartOfDay =
    (now - startOfDayInTimeZone) % bg.Time.Days(1).toMs();

  if (
    timeSinceStartOfDayInTimeZoneRelativeToUtcStartOfDay >=
    bg.Time.Days(1).toMs()
  ) {
    return (
      now -
      timeSinceStartOfDayInTimeZoneRelativeToUtcStartOfDay +
      bg.Time.Days(1).toMs()
    );
  }

  if (timeSinceStartOfDayInTimeZoneRelativeToUtcStartOfDay >= 0) {
    return now - timeSinceStartOfDayInTimeZoneRelativeToUtcStartOfDay;
  }

  return (
    now -
    timeSinceStartOfDayInTimeZoneRelativeToUtcStartOfDay -
    bg.Time.Days(1).toMs()
  );
}

describe("tz", () => {
  it("gmt+2", () => {
    // Thu Jun 15 2023 19:11:10 GMT+0000
    // Thu Jun 15 2023 21:11:10 GMT+0200
    const now = 1686857934872;

    // GMT+2
    const timeZoneOffsetMs = -7200000;

    const result = getStartOfDayInTzTimestamp(now, timeZoneOffsetMs);

    expect(result).toEqual(1686780000000);
  });

  it("gmt+0", () => {
    // Thu Jun 15 2023 19:11:10 GMT+0000
    const now = 1686857934872;

    // GMT+0
    const timeZoneOffsetMs = 0;

    const result = getStartOfDayInTzTimestamp(now, timeZoneOffsetMs);

    expect(result).toEqual(1686787200000);
  });

  it("gmt+5", () => {
    // Thu Jun 15 2023 19:11:10 GMT+0000
    // Thu Jun 16 2023 00:11:10 GMT+0200
    const now = 1686857934872;

    // GMT+5
    const timeZoneOffsetMs = -18000000;

    const result = getStartOfDayInTzTimestamp(now, timeZoneOffsetMs);

    expect(result).toEqual(1686855600000);
  });

  it("gmt-2", () => {
    // Thu Jun 15 2023 00:11:10 GMT+0000
    // Thu Jun 14 2023 22:11:10 GMT-0200
    const now = 1686787860714;

    // GMT+5
    const timeZoneOffsetMs = 7200000;

    const result = getStartOfDayInTzTimestamp(now, timeZoneOffsetMs);

    expect(result).toEqual(1686708000000);
  });
});
