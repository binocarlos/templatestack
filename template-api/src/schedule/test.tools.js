const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')

const fixtureData = () => yaml.safeLoad(fs.readFileSync(path.join(__dirname, 'fixtures', 'schedule.yaml'), 'utf8'))

module.exports = {
  fixtureData
}