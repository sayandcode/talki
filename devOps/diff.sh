#!/bin/bash

#initial setup
set -e
export $(grep -v '^#' .env | xargs)

yarn build:prod
cd infra
yarn diff

