import Field from './field'

export const processSchema = (schema) => {
  return Object.keys(schema || {}).reduce((all, name) => {
    const opts = Object.assign({}, {
      name
    }, schema[name])
    all[name] = Field(opts)
    return all
  }, {})
}

export const getSchemaDefaults = (schema) => {
  return Object.keys(schema || {}).reduce((all, name) => {
    const field = schema[name]
    all[name] = field.getDefault()
    return all
  }, {})
}

export const getInitialData = (schema, model) => {
  return Object.assign({}, getSchemaDefaults(schema), model)
}