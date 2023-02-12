import * as cdk from "aws-cdk-lib";
import { CfnOutput } from "aws-cdk-lib";
import { Construct } from "constructs";
import BackendLambda from "./constructs/backendLambda";

class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const lambda = new BackendLambda(this, "expressBackend");

    /* OUTPUTS */
    new CfnOutput(this, "BackendLambdaUrl", {
      value: lambda.urlObj.url,
      description: "The https endpoint where your app is hosted",
    });
  }
}

export default InfraStack;
