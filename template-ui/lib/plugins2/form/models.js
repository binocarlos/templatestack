// models process the data from the gui into the reducer
//
// normalize = gui      -> reducer
// format    = reduxcer -> gui
//
import dateLight from 'template-tools/src/utils/dateLight'
import yamlLib from '../../utils/yaml'

export const number = (opts = {}) => {
  return Object.assign({}, {
    normalize: (value) => {
      if(value.match(/\.$/)) return value
      // the case where it strips the last zero from an amount like 9.50
      if(value.match(/\.\d+0$/)) return value
      if(value.match(/^-0$/)) return value
      const num = parseFloat(value)
      return isNaN(num) ? value : num
      return value
    }
  }, opts)
}

export const date = (opts = {}) => {
  return Object.assign({}, {
    format: (value) => value ? new Date(value) : value,
    normalize: (value) => value ? dateLight.sqlDate(value, true) : null
  }, opts)
}

export const yaml = (opts = {}) => {
  const validator = (val) => yamlLib.validate(val)
  return Object.assign({}, {
    validate: [validator],
    multiline: true,
    rows: 10,
    // to input
    format: (value) => {
      value = value || {}
      return value.text
    },
    // from input
    normalize: (value) => {
      return {
        text: value,
        data: yamlLib.load(value),
      }      
    }
  }, opts)
}

const Models = {
  number,
  date,
  yaml,
}

export default Models