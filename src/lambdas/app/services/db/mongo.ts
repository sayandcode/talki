import mongoose from "mongoose";
import APP_ENV_VARS from "@appLambda/env";

const url = APP_ENV_VARS.MONGODB_CONNECTION_URL;

function getMongoClient() {
  return mongoose.createConnection(url);
}

export default getMongoClient;
