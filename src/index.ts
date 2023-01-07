import express from "express";
import setupMiddleware from "utils/setupMiddleware";
import setupRoutes from "utils/setupRoutes";

const app = express();

setupMiddleware(app);
setupRoutes(app);

app.listen(8080, () => console.log("listening on 8080"));
