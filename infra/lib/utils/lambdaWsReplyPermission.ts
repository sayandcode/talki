import { PolicyStatement, Effect } from "aws-cdk-lib/aws-iam";
import { Stack } from "aws-cdk-lib";
import WsApi from "../constructs/wsApi";

function getWsReplyPermission(stack: Stack, ws: WsApi) {
  const wsReplyPermission = new PolicyStatement({
    effect: Effect.ALLOW,
    actions: ["execute-api:Invoke", "execute-api:ManageConnections"],
    resources: [
      `arn:aws:execute-api:${stack.region}:${stack.account}:${ws.apiResource.attrApiId}/${ws.stageResource.stageName}/*/@connection*`,
    ],
  });
  return wsReplyPermission;
}

export default getWsReplyPermission;
