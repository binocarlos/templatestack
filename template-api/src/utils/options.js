const BLANK_TYPES = {
  undefined: true,
  null: true
}

const isBlankValue = (value) => {
  return BLANK_TYPES[typeof(value)] ?
    true :
    false
}

const getDefaultData = (data, opts) => {
  return Object.keys(opts.defaults || {}).reduce((all, key) => {
    if(isBlankValue(all[key])) {
      all[key] = opts.defaults[key]
    }
    return all
  }, data || {})
}

const throwErrorFields = (data, opts) => {
  const errorFields = getErrorFields(data, opts)
    .map(processedField => {
      const status = processedField.incorrectType ?
        `should be of type ${processedField.requiredType}` :
        `is a required option`
      return `${processedField.field} ${status}`
    })
  if(errorFields.length > 0) {
    throw new Error(errorFields.join(', '))
  }
}

const getErrorFields = (data, opts) => {
  data = data || {}
  opts = opts || {}
  const required = opts.required || []
  const defaults = opts.defaults || []
  return required
    .map(fieldDesc => {
      const [field, type] = fieldDesc.split(':')
      const value = data[field] || defaults[field]
      const isBlank = isBlankValue(value)
      const incorrectType = type && typeof(value) != type ?
        true :
        false
      return {
        field,
        isBlank,
        incorrectType,
        requiredType: type
      }
    })
    .filter(processedField => {
      return processedField.isBlank || processedField.incorrectType
    })
}

const processor = (data, opts) => {
  throwErrorFields(data, opts)
  return getDefaultData(data, opts)
}

module.exports = {
  getDefaultData,
  throwErrorFields,
  getErrorFields,
  processor
}