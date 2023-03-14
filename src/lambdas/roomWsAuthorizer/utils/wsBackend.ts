import WsBackend from "@utils/WsBackend";
import ROOM_WS_AUTHORIZER_ENV_VARS from "../env";

const wsUrl = ROOM_WS_AUTHORIZER_ENV_VARS.ROOM_WS_URL;
const wsBackendForRoomWsAuthorizer = new WsBackend(wsUrl);

export default wsBackendForRoomWsAuthorizer;
