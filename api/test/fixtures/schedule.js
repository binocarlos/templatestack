"use strict";

const path = require('path')
const fs = require('fs')
const yaml = require('js-yaml')


var config = {}

try {
  config = yaml.safeLoad(fs.readFileSync(path.join(__dirname, 'schedule.yaml'), 'utf8'))
} catch (e) {
  console.error('error loading yaml file')
  console.error(e)
  process.exit(1)
}

module.exports = config