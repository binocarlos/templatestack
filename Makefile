.PHONY: dev
dev: ; MANUALRUN=1 docker-compose -f docker-compose.yml -f docker-compose.linked.yml up

.PHONY: build
build: ; bash scripts/build.sh

.PHONY: deploy
deploy: ; bash scripts/deploy.sh