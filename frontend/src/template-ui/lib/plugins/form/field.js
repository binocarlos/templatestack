import dotty from 'dotty'

const GetValue = (name) => (data = {}) => data[name]
const SetValue = (value) => value

// return null for no error or string to describe the error
const Validate = (value) => null

// return the value to be used if no other value is present
const Default = (data) => null

const Field = (opts = {}) => {
  if(!opts.name) throw new Error('name required for Field')
  const name = opts.name
  const get = opts.get || GetValue(name)
  const set = opts.set || SetValue
  const validate = opts.validate || Validate
  const getDefault = opts.getDefault || Default
  return {
    name,
    get,
    set,
    validate,
    getDefault
  }
}

export default Field