import yaml from 'js-yaml'

const load = (val) => {
  try {
    var doc = yaml.safeLoad(val)
  } catch (e) {
    return {
      error: e
    }
  }
  return doc
}

const dump = (val) => {
  try {
    var string = yaml.safeDump(val)
  } catch (e) {
    return {
      error: e
    }
  }
  return string
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
  dump,
  validate,
}

export default ret