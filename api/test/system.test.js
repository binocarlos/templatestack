"use strict";
const packageJSON = require('../package.json')
const SystemTests = require('template-api/src/test/system.test.js')

SystemTests({
  version: packageJSON.version
})