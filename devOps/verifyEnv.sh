#!/bin/bash

cd "$(dirname "$0")" # acts like node:path

APP_ENV_SETUP="../src/utils/env.ts"
DEPLOY_ENV_SETUP="../infra/utils/env.ts"

cmp $APP_ENV_SETUP $DEPLOY_ENV_SETUP -b \
  && echo "Env setup files are same" \
  || (echo "Env setup files are different" && exit 1)

