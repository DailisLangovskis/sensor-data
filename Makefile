build-dev:
	docker-compose -f docker-compose.dev.yml build

build-prod:
	docker-compose -f docker-compose.prod.yml build

start-dev:
	docker-compose -f docker-compose.dev.yml up

start-prod:
	docker-compose -f docker-compose.prod.yml up

clear-database:
	docker-compose -f docker-compose.dev.yml run --rm --no-deps sensor-data-db bash /code/reset-empty-database.sh

add-user:
	docker exec reverse-proxy bash add_user.sh

auth:
	docker exec reverse-proxy bash auth_user.sh