import {
  CfnRoute,
  CfnIntegration,
  CfnRouteResponse,
  CfnIntegrationResponse,
  CfnRouteProps,
  CfnIntegrationProps,
} from "aws-cdk-lib/aws-apigatewayv2";
import { Construct } from "constructs";

type WsHttpRouteProps = {
  apiId: CfnRouteProps["apiId"];
  auth?: {
    authorizationType: CfnRouteProps["authorizationType"];
    authorizerId: CfnRouteProps["authorizerId"];
  };
  routeKey: CfnRouteProps["routeKey"];
  httpEndpoint: {
    uri: NonNullable<CfnIntegrationProps["integrationUri"]>;
    method: NonNullable<CfnIntegrationProps["integrationMethod"]>;
  };
  bodyTemplate: string;
  isResponseRequired: boolean;
};

class WsHttpRoute extends Construct {
  public readonly routeResource: CfnRoute;

  public readonly integrationResource: CfnIntegration;

  constructor(scope: Construct, id: string, props: WsHttpRouteProps) {
    super(scope, id);

    this.routeResource = new CfnRoute(this, "route", {
      apiId: props.apiId,
      routeKey: props.routeKey,
      routeResponseSelectionExpression: "$default",
      authorizationType: props.auth?.authorizationType,
      authorizerId: props.auth?.authorizerId,
    });

    this.integrationResource = new CfnIntegration(this, "integration", {
      apiId: props.apiId,
      connectionType: "INTERNET",
      integrationType: "HTTP",
      integrationUri: props.httpEndpoint.uri,
      integrationMethod: props.httpEndpoint.method,
      passthroughBehavior: "WHEN_NO_TEMPLATES",
      templateSelectionExpression: "\\$default",
      requestTemplates: {
        $default: props.bodyTemplate,
      },
    });
    this.routeResource.target = `integrations/${this.integrationResource.ref}`;

    if (!props.isResponseRequired) return;

    new CfnRouteResponse(this, "routeResponse", {
      apiId: props.apiId,
      routeId: this.routeResource.ref,
      routeResponseKey: "$default",
    });

    new CfnIntegrationResponse(this, "integrationResponse", {
      apiId: props.apiId,
      integrationId: this.integrationResource.ref,
      integrationResponseKey: "$default",
      templateSelectionExpression: "\\$default",
    });
  }
}

export default WsHttpRoute;
