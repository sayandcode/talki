import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
} from "@aws-sdk/client-apigatewaymanagementapi";
import APP_ENV_VARS from "@appLambda/env";

class WsBackend {
  private client: ApiGatewayManagementApiClient;

  private static getWsReplyEndpoint() {
    const replacementProtocol =
      APP_ENV_VARS.NODE_ENV === "development" ? "http://" : "https://";
    const wsReplyEndpoint = APP_ENV_VARS.ROOM_WS_URL.replace(
      /wss?:\/\//,
      replacementProtocol
    );
    return wsReplyEndpoint;
  }

  constructor() {
    this.client = new ApiGatewayManagementApiClient({
      endpoint: WsBackend.getWsReplyEndpoint(),
    });
  }

  async sendMsgToWs(ConnectionId: string, msg: any) {
    const cmd = new PostToConnectionCommand({
      ConnectionId,
      Data: JSON.stringify(msg) as any,
    });
    await this.client.send(cmd);
  }
}

const wsBackend = new WsBackend();

export default wsBackend;
