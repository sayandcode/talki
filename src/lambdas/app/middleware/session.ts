import session from "express-session";
import APP_ENV_VARS from "@appLambda/env";
import createRedisStore from "connect-redis";
import DatabaseClients from "@appLambda/services/db";

const { SESSION_SECRET, BACKEND_URL, FRONTEND_URL } = APP_ENV_VARS;

function makeSessionMiddlewareArr(databaseClients: DatabaseClients) {
  const RedisStore = createRedisStore(session);

  const sessionOptions: session.SessionOptions = {
    secret: SESSION_SECRET,
    store: new RedisStore({ client: databaseClients.redisClient }),
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
  return sessionMiddlewareArr;
}

export default makeSessionMiddlewareArr;