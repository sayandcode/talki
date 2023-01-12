import type { AuthStatusEndpoint } from "utils/endpoints/auth/status";
import authStatusEndpoint from "utils/endpoints/auth/status";
import backendFetch from "./backendFetch";

async function redirectIfLoggedIn(newUrl: string) {
  const isLoggedIn = await fetchIsLoggedIn();
  if (isLoggedIn) window.location.href = newUrl;
}

async function fetchIsLoggedIn() {
  const { url, method } = authStatusEndpoint;
  const res = await backendFetch(url, { method });
  const { isLoggedIn } = (await res.json()) as AuthStatusEndpoint["response"];
  return isLoggedIn;
}

// eslint-disable-next-line import/prefer-default-export
export { redirectIfLoggedIn };
