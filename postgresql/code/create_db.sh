#!/bin/bash
set -e
database=$(psql -U postgres -tc "SELECT datname FROM pg_catalog.pg_database WHERE lower(datname) = lower('$POSTGRES_DB')")
echo "Creating database:" $POSTGRES_DB
if (("$database" == $POSTGRES_DB))
then
echo "Creating shema...";
psql -d $POSTGRES_DB -a -U postgres -f /docker-entrypoint-initdb.d/schema.sql
else
echo "There is no $POSTGRES_DB database";
fi
