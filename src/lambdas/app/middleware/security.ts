import { Request, Response, NextFunction } from "express";
import cors, { CorsOptions } from "cors";
import APP_ENV_VARS from "@appLambda/env";

// cors
const corsOptions: CorsOptions = {
  origin: APP_ENV_VARS.FRONTEND_URL,
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
