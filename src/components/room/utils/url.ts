import type { RoomId } from "utils/types/Room";

function getRoomIdFromUrl(): RoomId | null {
  const currUrl = new URL(document.location.href);
  const roomId = currUrl.searchParams.get("roomId");
  return roomId;
}

function setRoomIdInUrl(roomId: RoomId) {
  const roomIdParam = new URLSearchParams({ roomId });
  window.history.replaceState(null, "", `?${roomIdParam}`);
}

function getRoomPageUnauthedRedirectPath() {
  const currUrl = new URL(document.location.href);
  const currPath = `/room${currUrl.search}`;
  const redirectPath = `/login?redirectTo=${currPath}`;
  return redirectPath;
}

export { getRoomIdFromUrl, getRoomPageUnauthedRedirectPath, setRoomIdInUrl };
