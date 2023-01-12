import session from "express-session";
import APP_ENV_VARS from "utils/setupEnv";

const { SESSION_SECRET, BACKEND_URL, FRONTEND_URL } = APP_ENV_VARS;

const sessionOptions: session.SessionOptions = {
  secret: SESSION_SECRET,
  store: new session.MemoryStore(),
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