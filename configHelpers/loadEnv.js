export default function loadEnv() {
  const { ENV, BACKEND_URL, ROOM_WS_URL } = process.env;
  const envVars = { ENV, BACKEND_URL, ROOM_WS_URL };

  const isEnvVarsValid = Object.values(envVars).every((val) => !!val);
  if (!isEnvVarsValid)
    throw new Error("Env variables are not defined correctly in .env-cmdrc");

  return envVars;
}
