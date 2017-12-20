.PHONY: dev
dev: ; MANUALRUN=1 docker-compose -f docker-compose.yml -f docker-compose.linked.yml up

.PHONY: build
build:
	docker-compose -f docker-compose.yml -f docker-compose.linked.yml build

.PHONY: schema
schema:
	docker exec -ti {{name}}_api yarn run knex -- migrate:latest

.PHONY: frontend.cli
frontend.cli:
	docker exec -ti {{name}}_frontend bash

.PHONY: api.cli
api.cli:
	docker exec -ti {{name}}_api bash

