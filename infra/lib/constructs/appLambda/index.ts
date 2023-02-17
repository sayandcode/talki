import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as path from "node:path";
import APP_ENV_VARS from "./env";

class BackendLambda extends Construct {
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
    });

    this.urlObj = this.fn.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
      cors: {
        allowedOrigins: ["*"],
        allowCredentials: true,
      },
    });
  }

  addWsUrl(wsUrl: string) {
    const wsEnvVarKey = "ROOM_WS_URL" satisfies keyof typeof APP_ENV_VARS;
    this.fn.addEnvironment(wsEnvVarKey, wsUrl);
  }
}

export default BackendLambda;
