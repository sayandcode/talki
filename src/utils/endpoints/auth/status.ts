import backendBaseUrl from "..";

type AuthStatusEndpoint = {
  body: void;
  response: { isLoggedIn: boolean };
};

const authStatusEndpoint = {
  url: `${backendBaseUrl}/auth/status`,
  method: "GET",
} as const;

export default authStatusEndpoint;
export type { AuthStatusEndpoint };
