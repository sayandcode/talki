#!/bin/bash

cd "$(dirname "$0")" # acts like node:path

APP_LOCAL_ENV_SETUP="../src/lambdas/app/env.ts"
APP_DEPLOY_ENV_SETUP="../infra/lib/constructs/appLambda/env.ts"

cmp $APP_LOCAL_ENV_SETUP $APP_DEPLOY_ENV_SETUP -b \
  && echo "App Lambda: Env setup files are same" \
  || (echo "App Lambda: files are different" && exit 1)

ROOM_WS_AUTHORIZER_LOCAL_ENV_SETUP="../src/lambdas/roomWsAuthorizer/env.ts"
ROOM_WS_AUTHORIZER_DEPLOY_ENV_SETUP="../infra/lib/constructs/roomWsAuthorizer/env.ts"

cmp $ROOM_WS_AUTHORIZER_LOCAL_ENV_SETUP $ROOM_WS_AUTHORIZER_DEPLOY_ENV_SETUP -b \
  && echo "RoomWsAuthorizer Lambda: Env setup files are same" \
  || (echo "RoomWsAuthorizer Lambda: files are different" && exit 1)
