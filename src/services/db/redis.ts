import Redis from "ioredis";
import APP_ENV_VARS from "utils/setupEnv";

const { REDIS_CONNECTION_URL } = APP_ENV_VARS;

const redisClient = new Redis(REDIS_CONNECTION_URL);

export default redisClient;
