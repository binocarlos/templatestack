.PHONY: setup
setup:
	mv template.env.dev env.dev
	mv template.env.prod env.prod

.PHONY: dev
dev: ; MANUALRUN=1 docker-compose -f docker-compose.yml -f docker-compose.linked.yml up

.PHONY: build
build:
	docker-compose -f docker-compose.yml -f docker-compose.linked.yml build

.PHONY: schema
schema:
	docker exec -ti bookingdev_api yarn run knex -- migrate:latest

.PHONY: frontend.cli
frontend.cli:
	docker exec -ti bookingdev_frontend bash

.PHONY: api.cli
api.cli:
	docker exec -ti bookingdev_api bash

.PHONY: clean
clean:
	docker rm -f bookingdev_frontend bookingdev_api bookingdev_postgres bookingdev_redis

.PHONY: database.create
database.create:
	docker exec bookingdev_api yarn run knex -- migrate:latest

.PHONY: database.destroy
database.destroy:
	cat scripts/sql/drop.sql | bash scripts/postgres.sh psql