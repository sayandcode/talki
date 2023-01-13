import toggleError from "scripts/components/auth/AnonymousSignInForm/errors";
import { resumeUserJourney } from "scripts/components/pages/login";
import authLoginEndpoint, {
  AuthLoginEndpoint,
} from "utils/endpoints/auth/login";
import backendFetch from "utils/functions/backendFetch";
import type Discriminate from "utils/types/Discriminate";

function handleAnonSignInFormSubmit(e: SubmitEvent) {
  e.preventDefault();
  toggleError(false);
  const formEl = e.target;

  if (!(formEl instanceof HTMLFormElement))
    throw new Error("Couldn't find form");

  const userName = getUserName(formEl);
  if (!userName) {
    toggleError(true, "Please enter a valid name");
    return;
  }

  attemptLogin(userName)
    .then(resumeUserJourney)
    .catch(() => toggleError(true, "Couldn't log in. Try again."));
}

function getUserName(anonSignInForm: HTMLFormElement) {
  const formData = new FormData(anonSignInForm);
  const username = formData.get("username");
  if (username && typeof username === "string") return username;
  return null;
}

function attemptLogin(
  name: Discriminate<AuthLoginEndpoint["body"], { type: "anon" }>["name"]
) {
  const { url, method, headers } = authLoginEndpoint;
  const body: AuthLoginEndpoint["body"] = { type: "anon", name };
  return backendFetch(url, { method, headers, body: JSON.stringify(body) });
}

export default handleAnonSignInFormSubmit;
