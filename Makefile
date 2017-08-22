.PHONY: dev
dev: ; MANUALRUN=1 docker-compose -f docker-compose.yml -f docker-compose.linked.yml up

.PHONY: build
build: ; bash scripts/build.sh

.PHONY: deploy
deploy: ; bash scripts/deploy.sh


.PHONY: frontend.cli
frontend.cli:
	docker exec -ti templatestack_frontend bash


.PHONY: api.cli
api.cli:
	docker exec -ti templatestack_api bash


.PHONY: postgres.migrate
postgres.migrate:
	docker exec -ti templatestack_api yarn run knex -- migrate:latest

.PHONY: postgres.seed
postgres.seed:
	docker exec -ti templatestack_api yarn run knex -- seed:run

.PHONY: postgres.reset
postgres.reset:
	cat scripts/sql/drop.sql | bash scripts/postgres.sh psql

.PHONY: postgres.cli
postgres.cli:
	docker exec -ti templatestack_postgres psql --user templatestack
