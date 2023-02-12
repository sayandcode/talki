#!/bin/bash

#initial setup
set -e
export $(grep -v '^#' .env | xargs)

OUT_DIR="dist.production"
yarn rimraf $OUT_DIR
yarn ncc build src/index.production.ts -m -o $OUT_DIR

