import { Express } from "express";
import errorMiddlewareArr from "@appLambda/middleware/errors";

function setupErrorHandlers(app: Express) {
  app.use([...errorMiddlewareArr]);
}

export default setupErrorHandlers;
