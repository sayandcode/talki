import { Express } from "express";
import sessionMiddlewareArr from "middleware/session";

function setupMiddleware(app: Express) {
  app.use([...sessionMiddlewareArr]);
}

export default setupMiddleware;
