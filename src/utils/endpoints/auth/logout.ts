import backendBaseUrl from "..";

type AuthLogoutEndpoint = {
  body: void;
  response: { msg: "Successfully logged out" };
};

const authLogoutEndpoint = {
  url: `${backendBaseUrl}/auth/logout`,
  method: "POST",
} as const;

export default authLogoutEndpoint;
export type { AuthLogoutEndpoint };
