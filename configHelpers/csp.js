import loadEnv from "./loadEnv.js";

const { ENV, BACKEND_URL, ROOM_WS_URL } = loadEnv();

const devCSPObj = {
  "default-src": "'none'",
  "img-src": "'self'",
  "script-src": ["'self'", "https://accounts.google.com/gsi/client"],
  "style-src": ["'unsafe-inline'", "https://accounts.google.com/gsi/style"],
  "frame-src": "https://accounts.google.com/",
  "connect-src": ["'self'", BACKEND_URL, ROOM_WS_URL],
};

const prodCSPObj = {
  "default-src": "'none'",
  "img-src": "'self'",
  "script-src": [
    "https://accounts.google.com/gsi/client",
    "'unsafe-inline'",
    "'self'",
  ],
  "style-src": [
    "'self'",
    "'unsafe-inline'",
    "https://accounts.google.com/gsi/style",
  ],
  "frame-src": "https://accounts.google.com/",
  "connect-src": [BACKEND_URL, ROOM_WS_URL],
};

const CSPObj = {
  development: devCSPObj,
  production: prodCSPObj,
}[ENV];
const CSPConfigStr = createCSPFromObj(CSPObj);

function createCSPFromObj(obj) {
  return Object.entries(obj)
    .map(([prop, valOrArrOfVals]) => {
      const finalVal = Array.isArray(valOrArrOfVals)
        ? valOrArrOfVals.join(" ")
        : valOrArrOfVals;

      return `${prop} ${finalVal}`;
    })
    .join("; ");
}

export default CSPConfigStr;
