import { Express } from "express";
import errorMiddlewareArr from "middleware/errors";
import securityMiddlewareArr from "middleware/security";
import sessionMiddlewareArr from "middleware/session";

function setupMiddleware(app: Express) {
  app.use([
    ...securityMiddlewareArr,
    ...sessionMiddlewareArr,
    ...errorMiddlewareArr,
  ]);
}

export default setupMiddleware;
