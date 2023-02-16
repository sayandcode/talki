import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as path from "node:path";
import APP_ENV_VARS from "../../utils/env";

class BackendLambda extends Construct {
  public fn: lambda.Function;

  public urlObj: lambda.FunctionUrl;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const codeLocalUri = path.join(__dirname, "../../../dist.production/app/");
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
}

export default BackendLambda;
