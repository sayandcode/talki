import backendBaseUrl from "..";

type AuthNonceEndpoint = {
  body: void;
  response: { nonce: number };
};

const authNonceEndpoint = {
  url: `${backendBaseUrl}/auth/nonce`,
  method: "GET",
} as const;

export default authNonceEndpoint;
export type { AuthNonceEndpoint };
