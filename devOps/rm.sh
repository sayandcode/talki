#!/bin/bash

#initial setup
set -e
export $(grep -v '^#' .env | xargs)

yarn rimraf infra/node_modules
yarn rimraf node_modules
