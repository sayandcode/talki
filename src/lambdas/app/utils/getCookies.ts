import { Request } from "express";

function getCookiesObjFromString(cookieString: Request["headers"]["cookie"]) {
  if (!cookieString) return {};

  const singleCookieStrings = cookieString.split("; ");
  const cookiesObj: Record<string, string> = {};
  singleCookieStrings.forEach((str) => {
    const regexResult = str.match(/(.+?)=(.+)/);
    if (!regexResult) return;

    const [, key, val] = regexResult as [unknown, string, string];
    cookiesObj[key] = val; // if no key then regexResult is null, so we can do non-null assertion
  });
  return cookiesObj;
}

export default getCookiesObjFromString;
