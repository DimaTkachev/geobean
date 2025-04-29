#!/bin/bash
set -e

host="$1"
shift
cmd="$@"

until mysqladmin ping -h "$host" -u root -ppassword --silent; do
  echo "MySQL is unavailable - sleeping"
  sleep 2
done

echo "MySQL is up - executing command"
exec $cmd