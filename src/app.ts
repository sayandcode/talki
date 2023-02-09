import express from "express";
import DatabaseClients from "services/db";
import setupErrorHandlers from "utils/setup/app/errorHandlers";
import setupMiddleware from "utils/setup/app/middleware";
import setupRoutes from "utils/setup/app/routes";

function makeApp(databaseClients: DatabaseClients) {
  const app = express();

  setupMiddleware(app, databaseClients);
  setupRoutes(app, databaseClients);
  setupErrorHandlers(app);

  return app;
}

export default makeApp;
