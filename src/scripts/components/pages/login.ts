function resumeUserJourney() {
  const currUrl = new URL(document.location.href);
  const urlToRedirectTo = currUrl.searchParams.get("redirectTo") || "/";
  window.location.href = urlToRedirectTo;
}

// eslint-disable-next-line import/prefer-default-export
export { resumeUserJourney };
