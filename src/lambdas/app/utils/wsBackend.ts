import APP_ENV_VARS from "@appLambda/env";
import WsBackend from "@utils/WsBackend";

const wsUrl = APP_ENV_VARS.ROOM_WS_URL;
const wsBackendForApp = new WsBackend(wsUrl);

export default wsBackendForApp;
