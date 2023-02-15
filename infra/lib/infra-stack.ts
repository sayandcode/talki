import * as cdk from "aws-cdk-lib";
import { CfnOutput } from "aws-cdk-lib";
import { Construct } from "constructs";
import BackendLambda from "./constructs/backendLambda";
import WsApi from "./constructs/wsApi";
import getWsEndpoint from "./utils/wsEndpoint";
import WsMockRoute from "./constructs/wsMockRoute";

class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /* CREATE RESOURCES */
    /* Lambda */
    const lambda = new BackendLambda(this, "expressBackend");

    /* Websocket */
    const ws = new WsApi(this, "roomWs", { name: "TalkiRoomWs" });
    const wsEndpoint = getWsEndpoint(ws);

    new WsMockRoute(this, "roomWsConnectRoute", {
      apiId: ws.apiResource.attrApiId,
      routeKey: "$connect",
      responseBody: "Successfully Connected", // you need a response to connect successfully
    });

    // override default error to obfuscate connectionId
    new WsMockRoute(this, "roomWsDefaultRoute", {
      apiId: ws.apiResource.attrApiId,
      routeKey: "$default",
      responseBody: "Invalid action. Please try with a different action.",
    });

    /* OUTPUTS */
    new CfnOutput(this, "BackendLambdaUrl", {
      value: lambda.urlObj.url,
      description: "The https endpoint where your app is hosted",
    });
    new CfnOutput(this, "RoomWsUrl", {
      value: wsEndpoint,
      description: "The ws endpoint where your app is hosted",
    });
  }
}

export default InfraStack;
