# booking saas

The repo for the booking system as a service

# design notes

## flexibility

Each customer will have different needs.  There is a compromise between:

 * being picky of who our customer is and not writing code for each one
 * having generic enough code that we make good money for not much work

To solve the tension between these two, we need to combine the following tools:

 * config driven components (yaml files)
 * libraries of code drivers - can be controlled from yaml files
 * specialised per customer code snippets that can be 'slotted' into a small part
 
The system needs to try and offer as many **hooks** as possible.

For example - the calendar is a config driven part where we say:

> given this YAML - make a list of days with attributes

We could design our system so the calendar module loaded the YAML and based on
what the YAML contained - produce the list of days.  This is pretty much what V1
is doing.

### config driven components

This is the most basic tool in that it means given some YAML:

```yaml
price: 20
fields:
  - type: checkbox
    title: include ice-cream
```

Generate some useful thing (either GUI components or config for another part of the system).

The YAML files are split up across each section  - copy and paste the YAML into a text editor 
if you want to change anything.

Over time, we can develop GUIs to allow the user to edit this YAML without knowing but to start with,
a SaaS platform consists of users-configuration being managed.


### drivers

By using the `driver` concept - we can make a `default` calendar driver.  It's
job is to turn our basic calendar format into an actual list of days within a range.

If the calendar config does not name a driver - `default` is assumed and the behaviour
is like we already have,

If the calendar config names `multiple_slots` as the driver - it can be a codebase
that understands a common requirement (having a day with multiple parallel bookable things).

A customer appears and they want the `multiple_slots` type calendar config - they can have
their own variables and each customer can use a different driver.

Apply this concept to every part of a booking system:

 * calendar
 * day schedule
 * options form
 * price calculation
 * info form
 * payment configuration
 * messaging

And each part can have drivers for the key steps - the more driver hooks the better, there is a very low
cost to adding a hook and it will give us unknown flexibility down the road.

### specialised code snippets

This is for when an existing driver will not cut the mustard and we need to have custom code written for a customer.

Specialised code should always be written as a driver - even if only used once it means we don't need another mechanism
for loading library code.

# data structures

## calendar

One of the main components of the system - this decides how to render the calendar view for booking forms.


### product

A thing that can be booked - a single calendar can display multiple products to book.

### schedule

Schedule data represents a single day shcedule for a product

 * date (date)
 * tracks ([]track)
   * title (string)
   * name (string)   
   * slots ([]slot)
     * title (string)
     * name (string)
     * time_start (time)
     * duration (int)
     * bookings ([]booking)


# developing

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
