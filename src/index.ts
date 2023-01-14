import express from "express";
import setupErrorHandlers from "utils/setupErrorHandlers";
import setupMiddleware from "utils/setupMiddleware";
import setupRoutes from "utils/setupRoutes";

const app = express();

setupMiddleware(app);
setupRoutes(app);
setupErrorHandlers(app);

// eslint-disable-next-line no-console
app.listen(8080, () => console.log("listening on 8080"));
