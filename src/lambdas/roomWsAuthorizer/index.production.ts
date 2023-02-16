import { APIGatewayRequestAuthorizerHandler as Handler } from "aws-lambda";

// eslint-disable-next-line import/prefer-default-export
export const handler: Handler = async (event) => {
  await Promise.resolve(1);

  const myParam1 = event.queryStringParameters?.["myParam1"];
  const isAllowed = myParam1 === "myVal1";

  return {
    principalId: "roomWsAuthorizer",
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: isAllowed ? "Allow" : "Deny",
          Resource: event.methodArn,
        },
      ],
    },
  };
};
