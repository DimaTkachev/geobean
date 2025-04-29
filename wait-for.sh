#!/bin/bash

host="$1"
shift
cmd="$@"

echo "Waiting for MySQL to be ready..."

while ! mysqladmin ping -h "$host" -u root -ppassword --silent --connect-timeout=30; do
    echo "MySQL is unavailable - sleeping"
    sleep 5
done

# Дополнительная проверка доступности базы
while ! mysql -h "$host" -u root -ppassword -e "USE testdb; SELECT 1;" &> /dev/null; do
    echo "Database testdb is not ready - sleeping"
    sleep 5
done

echo "MySQL and database are up - executing command"
exec $cmd