function generateAuthPolicy(isAllowed: boolean, Resource: string) {
  return {
    principalId: "roomWsAuthorizer",
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: isAllowed ? "Allow" : "Deny",
          Resource,
        },
      ],
    },
  };
}

export default generateAuthPolicy;
