#!/usr/bin/env bash

set -e

typeset -x LOGGLY_SUBDOMAIN=${1:-your-subdomain}
typeset -x LOGGLY_TOKEN=${2:-WU9VUl9MT0dHTFlfVE9LRU4=}
typeset -x NEW_RELIC_LICENSE_KEY=${3:-WU9VUl9ORVdfUkVMSUNfTElDRU5TRV9LRVk=}

WORKSPACE=/root/nodejs-express

echo "Running npm install ..."
docker run -it --rm -v $PWD:$WORKSPACE -w $WORKSPACE node:6 npm install

echo "Running localdev environment"
docker-compose rm -f
docker-compose build
docker-compose up --abort-on-container-exit
