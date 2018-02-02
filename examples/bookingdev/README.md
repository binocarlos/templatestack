# developing the stack

## build

```bash
$ make build
```

## start

```bash
$ make dev
$ make api.cli
$ node src/index.js
$ make frontend.cli
$ yarn run watch
```

## initial boot

After the first initial boot - there are no database tables, create them:

```bash
$ make schema
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
$ make api.cli
$ yarn run knex -- migrate:latest
```

#### create new migration for app

```bash
$ make api.cli
$ yarn run knex -- migrate:make mymigration
```

#### reset database

stop docker

```bash
$ rm -rf .data
```
