#!/usr/bin/env bash

if [ -z "$1" ]; then
  exec npm start
else
  exec "$@"
fi
