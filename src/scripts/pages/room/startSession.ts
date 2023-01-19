import { getRoomIdFromUrl } from "./url";

async function startSession() {
  const roomId = getRoomIdFromUrl();
  if (roomId) {
    console.log("Joining existing call");
    return;
  }
  console.log("Creating new room");
}

export default startSession;
