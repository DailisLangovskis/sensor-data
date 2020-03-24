FROM timescale/timescaledb-postgis:latest-pg11

COPY ./create_db.sh /docker-entrypoint-initdb.d/20-create_db.sh

# COPY ./dump/schema.sql /schema.sql
# COPY ./dump/data.sql /data.sql

RUN chmod +x /docker-entrypoint-initdb.d/20-create_db.sh