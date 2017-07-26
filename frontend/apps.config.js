const APPS = [{
  "name": "admin",
  "title": "Admin Panel"
}]

const CONFIG = {
  apps: APPS,
  // node_modules to run through babel
  babelModules: [
    'template-tools',
    'template-ui',
    'shared'
  ]
}

module.exports = CONFIG