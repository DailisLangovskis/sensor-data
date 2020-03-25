FROM timescale/timescaledb-postgis:latest-pg11

# COPY ./create_db.sh /docker-entrypoint-initdb.d/create_db.sh

COPY ./dump/shema.sql /docker-entrypoint-initdb.d


# RUN chmod +x /docker-entrypoint-initdb.d/create_db.sh