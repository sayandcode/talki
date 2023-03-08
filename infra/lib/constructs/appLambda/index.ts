import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { Stack } from "aws-cdk-lib";
import * as path from "node:path";
import APP_ENV_VARS from "./env";
import WsApi from "../wsApi";
import getWsReplyPermission from "../../utils/lambdaWsReplyPermission";

class AppLambda extends Construct {
  private fn: lambda.Function;

  public urlObj: lambda.FunctionUrl;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const codeLocalUri = path.join(
      __dirname,
      "../../../../dist.production/app/"
    );
    this.fn = new lambda.Function(this, "backendFunction", {
      runtime: lambda.Runtime.NODEJS_16_X,
      code: lambda.Code.fromAsset(codeLocalUri),
      handler: "index.handler",
      environment: APP_ENV_VARS,
      memorySize: 512,
    });

    this.urlObj = this.fn.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
    });
  }

  addWsUrl(wsUrl: string) {
    const wsEnvVarKey = "ROOM_WS_URL" satisfies keyof typeof APP_ENV_VARS;
    this.fn.addEnvironment(wsEnvVarKey, wsUrl);
  }

  addWsReplyPermission(ws: WsApi) {
    const thisStack = Stack.of(this);
    const wsReplyPermission = getWsReplyPermission(thisStack, ws);
    this.fn.addToRolePolicy(wsReplyPermission);
  }
}

export default AppLambda;
