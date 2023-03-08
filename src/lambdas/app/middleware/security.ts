import { Request, Response, NextFunction } from "express";
import cors, { CorsOptions } from "cors";
import APP_ENV_VARS from "@appLambda/env";

// cors
const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    const list = [APP_ENV_VARS.FRONTEND_URL, "https://localhost:3000"];
    const isOriginInList = list.includes(origin || "");
    if (!origin || isOriginInList)
      callback(null, true); // allow api gateway to access w/o origin set
    else callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
};
const corsMiddleware = cors(corsOptions);

// other headers
const securityHeadersMiddleware = (
  _: Request,
  res: Response,
  next: NextFunction
) => {
  res.set({
    "X-Content-Type-Options": "nosniff",
  });
  next();
};

const securityMiddlewareArr = [
  corsMiddleware,
  securityHeadersMiddleware,
] as const;

export default securityMiddlewareArr;
