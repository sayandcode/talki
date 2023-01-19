import type { RoomId } from "utils/types/Room";

function getRoomIdFromUrl(): RoomId | null {
  const currUrl = new URL(document.location.href);
  const roomId = currUrl.searchParams.get("roomId");
  return roomId;
}
// eslint-disable-next-line import/prefer-default-export
export { getRoomIdFromUrl };
