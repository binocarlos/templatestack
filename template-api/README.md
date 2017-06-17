# template-api

 * `interface` - the set of methods for a plugin
 * `handler` - incoming HTTP request / WebSocket / CLI method
 * `server` - using an interface, connect a transport to models
 * `model` - execute backend business logic
 * `transport` - method of getting messages between `clients` and `servers`


## auth

 * `auth.load`
   * id
 * `auth.login`
   * username
   * password
 * `auth.register`
   * data
 * `auth.update`
   * id
   * data