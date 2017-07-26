# template-stack


## build

```bash
$ docker-compose build
```

## start

Manually:

```bash
$ MANUALRUN=1 docker-compose up
```

API in other window:

```bash
$ docker exec -ti templateapp_api bash
$ node src/index.js
```

Frontend in other window:

```bash
$ docker exec -ti templateapp_frontend bash
$ yarn run watch
```

Automatically:

```bash
$ docker-compose up
```

#### linked

To run the stack linked against `template-stack`:

```bash
$ TEMPLATELINKED=1 MANUALRUN=1 docker-compose -f docker-compose.yml -f docker-compose.linked.yml up
```

## database ops

#### get psql CLI

```bash
$ bash scripts/postgres.sh psql
```

#### drop tables

```bash
$ cat scripts/sql/drop.sql | bash scripts/postgres.sh psql
```

#### create tables

```bash
$ docker exec -ti template_stack_api npm run knex -- migrate:latest
```

#### create new migration for app

```bash
$ docker exec -ti template_stack_api npm run knex -- migrate:make mymigration
```

#### reset database

stop docker

```bash
$ rm -rf .data
```

## run tests

```bash
$ docker exec -ti template_stack_api npm test
```



