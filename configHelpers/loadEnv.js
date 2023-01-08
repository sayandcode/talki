export default function loadEnv() {
  const { ENV } = process.env;

  const isEnvVarsValid = !!ENV;
  if (!isEnvVarsValid)
    throw new Error("Env variables are not defined correctly in .env-cmdrc");

  return { ENV };
}
