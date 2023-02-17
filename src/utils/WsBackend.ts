import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
} from "@aws-sdk/client-apigatewaymanagementapi";

class WsBackend {
  private client: ApiGatewayManagementApiClient;

  constructor(wsUrl: string) {
    const endpoint = wsUrl.replace(/wss?:\/\//, "https://");
    this.client = new ApiGatewayManagementApiClient({
      endpoint,
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

export default WsBackend;
