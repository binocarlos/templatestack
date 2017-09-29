// models process the data from the gui into the reducer
//
// normalize = gui      -> reducer
// format    = reduxcer -> gui
//
import dateLight from 'template-tools/src/utils/dateLight'

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

const Models = {
  number,
  date
}

export default Models