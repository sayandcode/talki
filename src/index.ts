import express from "express";
import setupErrorHandlers from "utils/setup/app/errorHandlers";
import setupMiddleware from "utils/setup/app/middleware";
import setupRoutes from "utils/setup/app/routes";

const app = express();

setupMiddleware(app);
setupRoutes(app);
setupErrorHandlers(app);

// eslint-disable-next-line no-console
app.listen(8080, () => console.log("listening on 8080"));
