#!/bin/bash

#initial setup
set -e
export $(grep -v '^#' .env | xargs)

cd infra/
yarn undeploy

