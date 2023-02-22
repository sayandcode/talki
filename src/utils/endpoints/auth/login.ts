import backendBaseUrl from "..";

type AuthLoginEndpoint = {
  body: { type: "anon"; name: string } | { type: "google"; idToken: string };
  response: { nonce: number };
};

const authLoginEndpoint = {
  url: `${backendBaseUrl}/auth/login`,
  method: "POST",
  headers: new Headers({
    "content-type": "application/json",
  }),
} as const;

export default authLoginEndpoint;
export type { AuthLoginEndpoint };
