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

Linked mode is used for having hot-reloading for:

 * template-tools
 * template-ui
 * template-api

To run in linked mode - first check `docker-compose.linked.yml` and make sure the modules above are pointing to a clone of this repo.  Here is an example from a project where `template-stack` is cloned alongside:

```yaml
version: '2'
services:
  frontend:
    extends:
      file: docker-compose.yml
      service: frontend
    volumes:
      - ./frontend:/app/frontend
      - /app/frontend/node_modules/
      - ../template-stack/template-tools:/app/frontend/node_modules/template-tools
      - ../template-stack/template-ui:/app/frontend/node_modules/template-ui
      - ./shared:/app/frontend/node_modules/shared
  api:
    extends:
      file: docker-compose.yml
      service: api
    volumes:
      - ./api:/app/api
      - /app/api/node_modules/
      - ../template-stack/template-tools:/app/frontend/node_modules/template-tools
      - ../template-stack/template-api:/app/api/node_modules/template-api
      - ./shared:/app/api/node_modules/shared
```

Then edit `frontend/apps.config` and add a `linkedModules` array so we get auto-rebuilding in the browser - here is an example:

```js
const CONFIG = {
  apps: [{
    "name": "admin",
    "title": "Admin Panel"
  }],
  // node_modules to run through babel
  linkedModules: [
    'template-tools',
    'template-ui',
    'shared'
  ]
}

module.exports = CONFIG
```

Then we run:

```bash
$ MANUALRUN=1 docker-compose -f docker-compose.yml -f docker-compose.linked.yml up
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



