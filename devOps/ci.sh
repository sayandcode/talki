#!/bin/bash

#initial setup
set -e
export $(grep -v '^#' .env | xargs)

yarn install --immutable --immutable-cache
cd infra/
yarn install --immutable --immutable-cache
