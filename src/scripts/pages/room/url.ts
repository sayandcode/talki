import type { RoomId } from "utils/types/Room";

function getRoomIdFromUrl(): RoomId | null {
  const currUrl = new URL(document.location.href);
  const roomId = currUrl.searchParams.get("roomId");
  return roomId;
}

function setRoomIdInUrl(roomId: RoomId) {
  const roomIdParam = new URLSearchParams({ roomId });
  window.history.pushState(null, "", `?${roomIdParam}`);
}

export { getRoomIdFromUrl, setRoomIdInUrl };
