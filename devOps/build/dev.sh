#!/bin/bash

#initial setup
set -e
export $(grep -v '^#' .env | xargs)

OUT_DIR="dist.development"
rimraf $OUT_DIR
tsc --outDir $OUT_DIR
tsc-alias --dir $OUT_DIR
