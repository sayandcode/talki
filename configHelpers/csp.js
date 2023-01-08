import loadEnv from "./loadEnv";

const { ENV } = loadEnv();

const devCSPObj = {
  "default-src": "'none'",
  "img-src": "'self'",
  "script-src": ["'self'", "https://accounts.google.com/gsi/client"],
  "style-src": ["'unsafe-inline'", "https://accounts.google.com/gsi/style"],
  "frame-src": "https://accounts.google.com/",
  "connect-src": "'self'",
};

const prodCSPObj = {
  "default-src": "'none'",
  "img-src": "'self'",
  "script-src": ["https://accounts.google.com/gsi/client", "'unsafe-inline'"],
  "style-src": [
    "'self'",
    "'unsafe-inline'",
    "https://accounts.google.com/gsi/style",
  ],
  "frame-src": "https://accounts.google.com/",
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
