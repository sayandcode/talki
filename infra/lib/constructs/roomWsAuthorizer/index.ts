import { CfnAuthorizer, CfnRouteProps } from "aws-cdk-lib/aws-apigatewayv2";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { Stack } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as path from "node:path";
import ROOM_WS_AUTHORIZER_ENV_VARS from "./env";

type Props = {
  apiId: CfnRouteProps["apiId"];
};

class RoomWsAuthorizer extends Construct {
  public readonly authorizerId: CfnAuthorizer["attrAuthorizerId"];

  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id);

    const codeLocalUri = path.join(
      __dirname,
      "../../../../dist.production/roomWsAuthorizer/"
    );
    const authFn = new lambda.Function(this, "authFn", {
      runtime: lambda.Runtime.NODEJS_16_X,
      code: lambda.Code.fromAsset(codeLocalUri),
      handler: "index.handler",
      environment: ROOM_WS_AUTHORIZER_ENV_VARS,
    });

    const { region, account } = Stack.of(this);
    const authorizer = new CfnAuthorizer(this, "authorizer", {
      name: "ConnectNonceLambdaAuthorizer",
      apiId: props.apiId,
      authorizerType: "REQUEST",
      authorizerUri: `arn:aws:apigateway:${region}:lambda:path/2015-03-31/functions/${authFn.functionArn}/invocations`,
      identitySource: [
        "route.request.querystring.roomId",
        "route.request.querystring.memberId",
        "route.request.querystring.nonce",
      ],
    });
    this.authorizerId = authorizer.attrAuthorizerId;

    new lambda.CfnPermission(this, "authFnCallPermissionForApiGw", {
      action: "lambda:InvokeFunction",
      functionName: authFn.functionArn,
      principal: "apigateway.amazonaws.com",
      sourceArn: `arn:aws:execute-api:${region}:${account}:${props.apiId}/authorizers/${this.authorizerId}`,
    });
  }
}

export default RoomWsAuthorizer;
