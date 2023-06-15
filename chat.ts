import * as bg from "@bgord/node";

const offset = -7200000;

const currentUTCTimestamp = Date.now();

const startOfDayUTC = new Date(currentUTCTimestamp);
startOfDayUTC.setUTCHours(0, 0, 0, 0);

const startOfMyDay = startOfDayUTC.getTime() + offset;

const diff = (currentUTCTimestamp - startOfMyDay) % bg.Time.Days(1).toMs();

console.log({
  currentUTCTimestamp,
  startOfMyDay,
  diff,
  diffViz: new Date(diff),
});

console.log("RESULT: ", currentUTCTimestamp - diff);
