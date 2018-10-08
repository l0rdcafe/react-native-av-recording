import { duration } from "moment";

const convertMillisToTime = ms => {
  const hrs = duration(ms).hours();
  const mins = duration(ms).minutes();
  const secs = duration(ms).seconds();
  const h = hrs !== 0 ? `${hrs}:` : "";
  const m = mins < 10 ? `0${mins}` : mins;
  const s = secs < 10 ? `0${secs}` : secs;
  return `${h}${m}:${s}`;
};

export default convertMillisToTime;
