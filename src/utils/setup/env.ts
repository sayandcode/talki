const {
  SESSION_SECRET,
  FRONTEND_URL,
  GOOGLE_CLIENT_ID,
  BACKEND_URL,
  REDIS_CONNECTION_URL,
  MONGODB_CONNECTION_URL,
  ROOM_WS_URL,
} = process.env;

const APP_ENV_VARS = {
  SESSION_SECRET,
  FRONTEND_URL,
  GOOGLE_CLIENT_ID,
  BACKEND_URL,
  REDIS_CONNECTION_URL,
  MONGODB_CONNECTION_URL,
  ROOM_WS_URL,
};

if (!getIsEnvValid(APP_ENV_VARS))
  throw new Error("Env variables not set correctly");

function getIsEnvValid<K extends string>(
  envObj: Record<K, any>
): envObj is Record<K, string> {
  return Object.values(envObj).every((val) => !!val && typeof val === "string");
}

// default exports are somewhat hoisted, so explicit typecasting reveals the effect of the typeguard
export default APP_ENV_VARS as typeof APP_ENV_VARS;
