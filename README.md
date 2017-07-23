# template-app

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

## database ops

#### get psql CLI

```bash
$ bash scripts/postgres.sh psql
```

#### reset database

```bash
$ cat scripts/sql/drop.sql | bash scripts/postgres.sh psql
```

#### create tables

```bash
$ docker exec -ti templateapp_api npm run knex -- migrate:latest
```

#### create new migration for app

```bash
$ docker exec -ti templateapp_api npm run knex -- migrate:make mymigration
```

## run tests

```bash
$ docker exec -ti templateapp_api npm test
```

