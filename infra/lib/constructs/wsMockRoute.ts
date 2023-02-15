import {
  CfnIntegration,
  CfnIntegrationResponse,
  CfnRoute,
  CfnRouteProps,
  CfnRouteResponse,
} from "aws-cdk-lib/aws-apigatewayv2";
import { Construct } from "constructs";

type WsMockRouteProps = {
  apiId: CfnRouteProps["apiId"];
  routeKey: CfnRouteProps["routeKey"];
  auth?: {
    authorizationType: CfnRouteProps["authorizationType"];
    authorizerId: CfnRouteProps["authorizerId"];
  };
  responseBody?: string;
};

class WsMockRoute extends Construct {
  constructor(scope: Construct, id: string, props: WsMockRouteProps) {
    super(scope, id);

    const routeResource = new CfnRoute(this, "wsMockRoute", {
      apiId: props.apiId,
      routeKey: props.routeKey,
      authorizationType: props.auth?.authorizationType,
      authorizerId: props.auth?.authorizerId,
    });

    const integrationResource = new CfnIntegration(this, "wsMockIntegration", {
      apiId: props.apiId,
      integrationType: "MOCK",
      passthroughBehavior: "WHEN_NO_TEMPLATES",
      requestTemplates: {
        $default: `{"statusCode":200}`,
      },
      templateSelectionExpression: "\\$default",
    });
    routeResource.target = `integrations/${integrationResource.ref}`;

    if (!props.responseBody) return; // assume user doesn't need a response to this mock

    new CfnRouteResponse(this, "wsMockRouteResponse", {
      apiId: props.apiId,
      routeResponseKey: "$default",
      routeId: routeResource.ref,
    });

    new CfnIntegrationResponse(this, "wsMockIntegrationResponse", {
      apiId: props.apiId,
      integrationId: integrationResource.ref,
      integrationResponseKey: "$default",
      templateSelectionExpression: "\\$default",
      responseTemplates: {
        $default: props.responseBody,
      },
    });
  }
}

export default WsMockRoute;
