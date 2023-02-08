import { Redis } from "ioredis";
import APP_ENV_VARS from "utils/setup/env";

const url = APP_ENV_VARS.REDIS_CONNECTION_URL;

const redisClient = new Redis(url);

export default redisClient;
