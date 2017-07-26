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
NETWORK_NAME=`echo "${STACKNAME}" | sed 's/_//'`"_default"
POSTGRES_NAME="${STACKNAME}_postgres"

function connect() {
  docker run -i --rm ${EXTRA_DOCKER_ARGS} \
    --network ${NETWORK_NAME} \
    --link ${POSTGRES_NAME}:${POSTGRES_HOST} \
    -e PGPASSWORD=${POSTGRES_PASSWORD} \
    postgres $@
}

function psql() {
  local cmd="psql --host ${POSTGRES_HOST} --username ${POSTGRES_USER} --dbname ${POSTGRES_DATABASE} $@"
  if [ -t 0 ]; then
    echo 'connecting to postgres'
    export EXTRA_DOCKER_ARGS="${EXTRA_DOCKER_ARGS} -t "
  fi
  connect ${cmd}
}

function backup() {
  local cmd="pg_dump --host ${POSTGRES_HOST} --username ${POSTGRES_USER} ${POSTGRES_DATABASE}"
  connect ${cmd}
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