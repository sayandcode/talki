import backendBaseUrl from "..";

type RoomCreateEndpoint = {
  body: {},
  response: {
    wsUrl: string;
    roomId: string;
    memberId: string;
    nonce: string;
    expireAt: string;
  };
};

const roomCreateEndpoint = {
  url: `${backendBaseUrl}/room/create`,
  method: "POST",
} as const;

export default roomCreateEndpoint;
export type { RoomCreateEndpoint };
