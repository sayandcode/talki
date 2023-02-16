import express from "express";
import setupErrorHandlers from "@appLambda/utils/setup/app/errorHandlers";
import setupMiddleware from "@appLambda/utils/setup/app/middleware";
import setupRoutes from "@appLambda/utils/setup/app/routes";
import DatabaseClients from "@appLambda/services/db";

function makeApp(databaseClients: DatabaseClients) {
  const app = express();

  setupMiddleware(app, databaseClients);
  setupRoutes(app, databaseClients);
  setupErrorHandlers(app);

  return app;
}

export default makeApp;
