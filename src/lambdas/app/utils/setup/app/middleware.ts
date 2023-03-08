import { Express, json, urlencoded } from "express";
import errorMiddlewareArr from "@appLambda/middleware/errors";
import securityMiddlewareArr from "@appLambda/middleware/security";
import makeSessionMiddlewareArr from "@appLambda/middleware/session";
import DatabaseClients from "@appLambda/services/db";

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
