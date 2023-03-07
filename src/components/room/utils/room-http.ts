import roomCreateEndpoint, {
  RoomCreateEndpoint,
} from "utils/endpoints/room/create";
import roomJoinEndpoint, { RoomJoinEndpoint } from "utils/endpoints/room/join";
import backendFetch from "utils/functions/backendFetch";
import type { RoomId } from "utils/types/Room";

async function createRoom(): Promise<RoomCreateEndpoint["response"]> {
  const { url, method } = roomCreateEndpoint;
  const res = await backendFetch(url, { method });
  return res.json();
}

type JoinAttempt =
  | { success: false }
  | { success: true; data: Awaited<ReturnType<typeof joinRoom>> };
async function tryJoinRoom(roomId: RoomId): Promise<JoinAttempt> {
  try {
    const roomData = await joinRoom(roomId);
    return { success: true, data: roomData } as const;
  } catch {
    return { success: false } as const;
  }
}

async function joinRoom(roomId: RoomId): Promise<RoomJoinEndpoint["response"]> {
  const { url, headers, method } = roomJoinEndpoint;
  const body: RoomJoinEndpoint["body"] = { roomId };
  const res = await backendFetch(url, {
    method,
    headers,
    body: JSON.stringify(body),
  });
  return res.json();
}

export { createRoom, tryJoinRoom };
