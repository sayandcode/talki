import backendBaseUrl from "..";

type RoomJoinEndpoint = {
  body: {
    roomId: string;
  };
  response: {
    wsUrl: string;
    roomId: string;
    memberId: string;
    nonce: string;
    expireAt: string;
  };
};

const roomJoinEndpoint = {
  url: `${backendBaseUrl}/room/join`,
  method: "POST",
} as const;

export default roomJoinEndpoint;
export type { RoomJoinEndpoint };
