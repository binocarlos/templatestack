import dotty from 'dotty'

const GetValue = (name) => (data) => dotty.get(data, name)
const SetValue = (name) => (data, value) => {
  dotty.put(data, name, value)
  return data
}
const CustomSetValue = (fn) => (data, value) => {
  fn(data, value)
  return data
}
const noopValidate = (value, data) => null
const noopDefault = (data) => null

const Field = (opts = {}) => {
  if(!opts.name) throw new Error('name required for Field')
  const name = opts.name
  const get = opts.get || GetValue(name)
  const set = opts.set ? CustomSetValue(opts.set) : SetValue(name)
  const validate = opts.validate || noopValidate
  const getDefault = opts.getDefault || noopDefault
  return {
    name,
    get,
    set,
    validate,
    getDefault
  }
}

export default Field