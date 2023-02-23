import type { AuthStatusEndpoint } from "utils/endpoints/auth/status";
import authStatusEndpoint from "utils/endpoints/auth/status";
import backendFetch from "./backendFetch";

/**
 * @returns boolean whether or not redirection took place
 */
async function redirectIfLoggedIn(newUrl: string) {
  const isLoggedIn = await fetchIsLoggedIn();
  if (isLoggedIn) {
    redirectToInternalUrl(newUrl);
    return true;
  }
  return false;
}

/**
 * @returns boolean whether or not redirection took place
 */
async function redirectIfNotLoggedIn(newUrl: string) {
  const isLoggedIn = await fetchIsLoggedIn();
  if (!isLoggedIn) {
    redirectToInternalUrl(newUrl);
    return true;
  }
  return false;
}

function redirectToInternalUrl(newUrl: string) {
  window.location.href = `/talki${newUrl}`;
}

async function fetchIsLoggedIn() {
  const { url, method } = authStatusEndpoint;
  const res = await backendFetch(url, { method });
  const { isLoggedIn } = (await res.json()) as AuthStatusEndpoint["response"];
  return isLoggedIn;
}

export { redirectIfNotLoggedIn, redirectIfLoggedIn, redirectToInternalUrl };
