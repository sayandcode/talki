import { connect } from "mongoose";
import APP_ENV_VARS from "utils/setup/env";

const url = APP_ENV_VARS.MONGODB_CONNECTION_URL;
void connect(url);
