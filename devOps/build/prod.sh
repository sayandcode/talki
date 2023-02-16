#!/bin/bash

#initial setup
set -e
export $(grep -v '^#' .env | xargs)

yarn rimraf dist.production/
# build backend app
yarn ncc build src/lambdas/app/index.production.ts -m -o dist.production/app
# build roomWsAuthorizer
yarn ncc build src/lambdas/roomWsAuthorizer/index.production.ts -m -o dist.production/roomWsAuthorizer