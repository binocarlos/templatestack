#!/bin/bash -e
#
# scripts to manage the postgres database
#

set -e

export DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cat ${DIR}/sql/drop.sql | bash ${DIR}/postgres.sh psql
docker exec -ti templateapp_api npm run knex -- migrate:latest