#!/bin/bash -e

set -e

export DEBIAN_FRONTEND=noninteractive

if [ -z "$TEMPLATE" ]; then
  echo >&2 "TEMPLATE var needed"
  exit 1
fi

if [ -z "$FOLDER" ]; then
  echo >&2 "FOLDER var needed"
  exit 1
fi

if [ ! -d "/templates/$TEMPLATE" ]; then
  echo >&2 "template $TEMPLATE does not exist"
  exit 1
fi

khaos create -d /templates $TEMPLATE /output/$FOLDER