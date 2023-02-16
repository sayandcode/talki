import { Redis } from "ioredis";
import APP_ENV_VARS from "@utils/env";

const url = APP_ENV_VARS.REDIS_CONNECTION_URL;

function getRedisClient() {
  return new Redis(url);
}

export default getRedisClient;
