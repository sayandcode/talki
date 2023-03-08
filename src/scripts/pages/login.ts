import { redirectToInternalUrl } from "utils/functions/redirects";

function resumeUserJourney() {
  const currUrl = new URL(document.location.href);
  const urlToRedirectTo = currUrl.searchParams.get("redirectTo") || "/";
  redirectToInternalUrl(urlToRedirectTo);
}

// eslint-disable-next-line import/prefer-default-export
export { resumeUserJourney };
