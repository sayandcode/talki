import * as cdk from "aws-cdk-lib";
import { CfnOutput } from "aws-cdk-lib";
import { Construct } from "constructs";
import AppLambda from "./constructs/appLambda";
import WsApi from "./constructs/wsApi";
import getWsEndpoint from "./utils/wsEndpoint";
import WsMockRoute from "./constructs/wsMockRoute";
import RoomWsAuthorizer from "./constructs/roomWsAuthorizer";
import WsHttpRoute from "./constructs/wsHttpRoute";

class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /* CREATE RESOURCES */
    /* Lambda */
    const appLambda = new AppLambda(this, "appLambda");
    const appLambdaUrl = appLambda.urlObj.url;

    /* Websocket */
    const ws = new WsApi(this, "roomWs", { name: "TalkiRoomWs" });
    const wsEndpoint = getWsEndpoint(ws);

    // $connect route
    const roomWsAuthorizer = new RoomWsAuthorizer(this, "roomWsAuthorizer", {
      apiId: ws.apiResource.attrApiId,
    });
    new WsMockRoute(this, "roomWsConnectRoute", {
      apiId: ws.apiResource.attrApiId,
      routeKey: "$connect",
      auth: {
        authorizationType: "CUSTOM",
        authorizerId: roomWsAuthorizer.authorizerId,
      },
      responseBody: "Successfully Connected", // you need a response to connect successfully
    });

    // $default route
    // override default error to obfuscate connectionId
    new WsMockRoute(this, "roomWsDefaultRoute", {
      apiId: ws.apiResource.attrApiId,
      routeKey: "$default",
      responseBody: "Invalid action. Please try with a different action.",
    });

    // allowMemberInRoom route
    new WsHttpRoute(this, "roomWsAllowMemberInRoomRoute", {
      apiId: ws.apiResource.attrApiId,
      routeKey: "allowMemberInRoom",
      httpEndpoint: {
        method: "POST",
        uri: `${appLambdaUrl}room/ws/allowMemberInRoom`, // lambda url ends with '/'
      },
      bodyTemplate: `
{
  "connectionId": "$context.connectionId",
  "isAllowedInRoom": $input.json('$.payload.isAllowedInRoom'),
  "newMemberId": $input.json('$.payload.newMemberId'),
  "roomId": $input.json('$.payload.roomId')
}
`,
      isResponseRequired: false,
    });

    // sendSdp route
    new WsHttpRoute(this, "roomWsSendSdpRoute", {
      apiId: ws.apiResource.attrApiId,
      routeKey: "sendSdp",
      httpEndpoint: {
        method: "POST",
        uri: `${appLambdaUrl}room/ws/sendSdp`, // lambda url ends with '/'
      },
      bodyTemplate: `
{
  "connectionId": "$context.connectionId",
  "receiverMemberId": $input.json('$.payload.receiverMemberId'),
  "roomId": $input.json('$.payload.roomId'),
  "sdp": $input.json('$.payload.sdp')
}
`,
      isResponseRequired: false,
    });

    /* WIRING */
    // lambda
    appLambda.addWsUrl(wsEndpoint);
    appLambda.addWsReplyPermission(ws);
    roomWsAuthorizer.addWsUrl(wsEndpoint);
    roomWsAuthorizer.addWsReplyPermission(ws);

    /* OUTPUTS */
    new CfnOutput(this, "BackendLambdaUrl", {
      value: appLambdaUrl,
      description: "The https endpoint where your app is hosted",
    });
    new CfnOutput(this, "RoomWsUrl", {
      value: wsEndpoint,
      description: "The ws endpoint where your app is hosted",
    });
  }
}

export default InfraStack;
