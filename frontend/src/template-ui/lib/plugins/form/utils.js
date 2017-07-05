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

export const getDefaults = (schema) => {
  return Object.keys(schema || {}).reduce((all, name) => {
    const field = schema[name]
    all[name] = field.getDefault()
    return all
  }, {})
}

// process the raw model via defaults
export const getModelData = (schema, model) => {
  return Object.assign({}, getDefaults(schema), model)
}

// process the current model via get functions
export const getFormData = (schema, model) => {
  return Object.keys(schema || {}).reduce((all, name) => {
    const field = schema[name]
    all[name] = field.toForm(field.get(model))
    return all
  }, {})
}

export const getMetaData = (schema, model = {}, allmeta = {}) => {
  return Object.keys(schema || {}).reduce((all, name) => {
    const existingMeta = allmeta[name] || {}
    const field = schema[name]
    const value = field.get(model)
    const error = field.validate(value)
    all[name] = Object.assign({}, existingMeta, {
      valid: error ? false : true,
      error,
      touched: false,
      focused: false
    })
    return all
  }, {})
}