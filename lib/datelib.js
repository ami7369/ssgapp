import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);

export function dateToJST(convertDate,format="YYYYMM") {
  const convertJST = dayjs(convertDate).tz("Asia/Tokyo").format(format);
  return convertJST;
}

export function dateToUTC({yyyy,mm,dd},time="00:00:00") {
  const JST = `${yyyy}-${mm}-${dd}T${time}+0900`
  //console.log((("||MSG-dateToUTC||"+JST);
  const UTCdate = dayjs.utc(JST).format();
  //console.log(((UTCdate);
  return UTCdate;
}

export function formatDate(convertData, format="YYYY") {
  const formattedDate = dayjs.utc(convertData).tz("Asia/Tokyo").format(format);
  return formattedDate;
}

export const groupByDate = function (data, { format, attribute }) {
  return data.reduce(function (group, x) {
    const formatString = formatDate(new Date(x[attribute]), format);
    (group[formatString] = group[formatString] || []).push(x);
    return group;
  }, {});
};