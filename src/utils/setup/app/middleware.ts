import { Express, json, urlencoded } from "express";
import errorMiddlewareArr from "middleware/errors";
import securityMiddlewareArr from "middleware/security";
import sessionMiddlewareArr from "middleware/session";

function setupMiddleware(app: Express) {
  app.use([
    json(),
    urlencoded({ extended: true }),
    ...securityMiddlewareArr,
    ...sessionMiddlewareArr,
    ...errorMiddlewareArr,
  ]);
}

export default setupMiddleware;
