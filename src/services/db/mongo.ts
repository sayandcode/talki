import mongoose from "mongoose";
import APP_ENV_VARS from "utils/setup/env";

const url = APP_ENV_VARS.MONGODB_CONNECTION_URL;

const mongoClient = mongoose.createConnection(url);

export default mongoClient;
