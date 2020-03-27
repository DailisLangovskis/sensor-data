FROM timescale/timescaledb-postgis:latest-pg11

COPY ./dump/schema.sql /docker-entrypoint-initdb.d
COPY ./dump/data.sql /docker-entrypoint-initdb.d
COPY ./code/create_db.sh /docker-entrypoint-initdb.d/create_db.sh

RUN chmod +x /docker-entrypoint-initdb.d/create_db.sh

