.PHONY: dev
dev: ; MANUALRUN=1 docker-compose -f docker-compose.yml -f docker-compose.linked.yml up

.PHONY: build
build:
	docker-compose -f docker-compose.yml -f docker-compose.linked.yml build

.PHONY: frontend.cli
frontend.cli:
	docker exec -ti templatestack_frontend bash

.PHONY: api.cli
api.cli:
	docker exec -ti templatestack_api bash

