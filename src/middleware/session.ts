import session from "express-session";
import APP_ENV_VARS from "utils/setupEnv";

const sessionOptions: session.SessionOptions = {
  secret: APP_ENV_VARS.SESSION_SECRET,
  store: new session.MemoryStore(),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
  },
  saveUninitialized: false,
};

const sessionMiddlewareArr = [session(sessionOptions)] as const;

export default sessionMiddlewareArr;
