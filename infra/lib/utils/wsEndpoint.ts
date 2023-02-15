import WsApi from "../constructs/wsApi";

function getWsEndpoint(ws: WsApi) {
  const wsEndpointBase = ws.apiResource.attrApiEndpoint;
  const wsStageName = ws.stageResource.stageName;
  const wsEndpoint = `${wsEndpointBase}/${wsStageName}`;
  return wsEndpoint;
}

export default getWsEndpoint;
