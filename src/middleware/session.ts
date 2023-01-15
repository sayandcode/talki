import session from "express-session";
import APP_ENV_VARS from "utils/setupEnv";
import createRedisStore from "connect-redis";
import { createClient } from "redis";

const { SESSION_SECRET, BACKEND_URL, FRONTEND_URL, REDIS_CONNECTION_URL } =
  APP_ENV_VARS;

const RedisStore = createRedisStore(session);
const redisClient = createClient({
  legacyMode: true,
  url: REDIS_CONNECTION_URL,
});
redisClient.connect();

const sessionOptions: session.SessionOptions = {
  secret: SESSION_SECRET,
  store: new RedisStore({ client: redisClient }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    secure: [FRONTEND_URL, BACKEND_URL].every((url) =>
      url.startsWith("https:")
    ), // set to true when hosted on https
  },
  saveUninitialized: false,
  resave: false,
};

const sessionMiddlewareArr = [session(sessionOptions)] as const;

export default sessionMiddlewareArr;
