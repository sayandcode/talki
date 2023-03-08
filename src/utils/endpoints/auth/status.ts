import type { RoomUserData } from "utils/types/Room";
import backendBaseUrl from "..";

type AuthStatusEndpoint = {
  body: void;
  response:
    | { isLoggedIn: false }
    | { isLoggedIn: true; userData: RoomUserData };
};

const authStatusEndpoint = {
  url: `${backendBaseUrl}/auth/status`,
  method: "GET",
} as const;

export default authStatusEndpoint;
export type { AuthStatusEndpoint };
