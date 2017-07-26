#!/bin/bash -e
#
# scripts to manage the postgres database
#

set -e

export DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

export STACKNAME="templatestack"
