build-dev:
	docker-compose -f docker-compose.dev.yml build

build-prod:
	docker-compose -f docker-compose.prod.yml build

start-dev:
	docker-compose -f docker-compose.dev.yml up

start-prod:
	docker-compose -f docker-compose.prod.yml up

build-npm-link-hsl:
	docker-compose -f docker-compose.dev.yml build --no-cache && npm link hslayers-ng