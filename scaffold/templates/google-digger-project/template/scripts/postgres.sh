#!/bin/bash -e
#
# scripts to manage the postgres database
#

set -e

export DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
source ${DIR}/vars.sh

POSTGRES_HOST="postgres"
POSTGRES_USER="${STACKNAME}"
POSTGRES_PASSWORD="${STACKNAME}"
POSTGRES_DATABASE="${STACKNAME}"
NETWORK_NAME="${STACKNAME}_default"
POSTGRES_NAME="${STACKNAME}_postgres"

function connect() {
  local flags=""
  if [ -t 0 ]; then
    flags="t"
  fi
  eval "docker exec -i${flags} ${POSTGRES_NAME} "$@""
}

function psql() {
  connect "psql --user ${POSTGRES_USER} $@"
}

function backup() {
  connect "pg_dump --user ${POSTGRES_USER} $@"
}

function usage() {
cat <<EOF
Usage:
  psql                 run connected psql
  backup               dump the database $1 (default = boiler)
  help                 display this message
EOF
  exit 1
}

function main() {
  case "$1" in
  psql)            shift; psql $@;;
  backup)          shift; backup $@;;
  help)            shift; usage $@;;
  *)               psql $@;;
  esac
}

main "$@"