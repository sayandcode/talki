const { MONGODB_CONNECTION_URL } = process.env;

const ROOM_WS_AUTHORIZER_ENV_VARS = { MONGODB_CONNECTION_URL };

if (!getIsEnvValid(ROOM_WS_AUTHORIZER_ENV_VARS))
  throw new Error("Env variables not set correctly");

function getIsEnvValid<K extends string>(
  envObj: Record<K, any>
): envObj is Record<K, string> {
  return Object.values(envObj).every((val) => !!val && typeof val === "string");
}

// default exports are somewhat hoisted, so explicit typecasting reveals the effect of the typeguard
export default ROOM_WS_AUTHORIZER_ENV_VARS as typeof ROOM_WS_AUTHORIZER_ENV_VARS;
