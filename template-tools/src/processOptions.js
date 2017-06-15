const BLANK_TYPES = {
  undefined: true,
  null: true
}

const processOptions = (data, opts) => {
  const required = opts.required || []
  const defaults = opts.defaults || {}
  const missing = required.filter(field => {
    const value = data[field]
    return BLANK_TYPES[typeof(value)] ?
      true :
      false
  })
  if(missing.length > 0 && opts.throwError) {
    throw new Error(missing.join(', ') + ' required')
  }
  return Object.assign({}, defaults, data)
}

module.exports = processOptions