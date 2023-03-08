import { CfnApi, CfnStage } from "aws-cdk-lib/aws-apigatewayv2";
import { Construct } from "constructs";

type Props = {
  name: CfnApi["name"];
};

class WsApi extends Construct {
  public apiResource: CfnApi;

  public stageResource: CfnStage;

  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id);

    this.apiResource = new CfnApi(this, "BackendWsApi", {
      name: props.name,
      protocolType: "WEBSOCKET",
      routeSelectionExpression: "$request.body.action",
    });

    this.stageResource = new CfnStage(this, "ApiStage", {
      stageName: "production",
      apiId: this.apiResource.attrApiId,
      autoDeploy: true,
    });
  }
}

export default WsApi;
