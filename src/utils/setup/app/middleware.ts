import { Express, json, urlencoded } from "express";
import errorMiddlewareArr from "middleware/errors";
import securityMiddlewareArr from "middleware/security";
import makeSessionMiddlewareArr from "middleware/session";
import DatabaseClients from "services/db";

function setupMiddleware(app: Express, databaseClients: DatabaseClients) {
  app.use([
    json(),
    urlencoded({ extended: true }),
    ...securityMiddlewareArr,
    ...makeSessionMiddlewareArr(databaseClients),
    ...errorMiddlewareArr,
  ]);
}

export default setupMiddleware;
