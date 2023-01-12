type FetchParams = Parameters<typeof fetch>;

// to allow cross origin requests with cookie sharing
function backendFetch(url: FetchParams[0], opts?: FetchParams[1]) {
  const newOpts = {
    ...opts,
    credentials: "include" as const,
  };
  return fetch(url, newOpts);
}

export default backendFetch;
