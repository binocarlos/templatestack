import yaml from 'js-yaml'

const load = (val) => {
  try {
    var doc = yaml.safeLoad(val)
  } catch (e) {
    return {
      error: e
    }
  }
  return {doc}
}

const validate = (val) => {
  try {
    var doc = yaml.safeLoad(val)
  } catch (e) {
    return e.toString()
  }
  return undefined
}

const ret = {
  load,
  validate
}

export default ret