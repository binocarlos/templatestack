import dotty from 'dotty'

const GetValue = (name) => (data) => dotty.get(data, name)
const SetValue = (name) => (data, value) => dotty.put(data, name, value)

const Field = (opts = {}) => {
  if(!opts.name) throw new Error('name required for Field')
  const name = opts.name
  const get = opts.get ? opts.get : GetValue(name)
  const set = opts.set ? opts.set : SetValue(name)
  return {
    name,
    get,
    set 
  }
}

export default Field