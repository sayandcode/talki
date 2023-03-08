#!/bin/bash

#initial setup
set -e
export $(grep -v '^#' .env | xargs)

bash devOps/verifyEnv.sh
yarn build:prod
cd infra/
yarn deploy


