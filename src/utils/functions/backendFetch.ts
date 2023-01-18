type FetchParams = Parameters<typeof fetch>;

// to allow cross origin requests with cookie sharing
async function backendFetch(url: FetchParams[0], opts?: FetchParams[1]) {
  const newOpts = {
    ...opts,
    credentials: "include" as const,
  };
  const res = await fetch(url, newOpts);
  if (!res.ok) {
    const { msg = "Something went wrong" } = await getData(res);
    throw new Error(msg);
  }
  return res;
}

async function getData(res: Response) {
  const isJson = res.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await res.json() : null;
  return data as Record<string, string>;
}

export default backendFetch;
