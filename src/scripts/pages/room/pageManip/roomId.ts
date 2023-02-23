import type { RoomId } from "utils/types/Room";

const ROOM_ID_CONTAINER_ID = "room-id-container";

function setRoomIdOnPage(roomId: RoomId) {
  const roomIdSpan = document.getElementById(ROOM_ID_CONTAINER_ID);
  if (!roomIdSpan) throw new Error("Room id span not found");
  roomIdSpan.textContent = roomId;
}

export default setRoomIdOnPage;
export { ROOM_ID_CONTAINER_ID };
