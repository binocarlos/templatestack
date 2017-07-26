// http://redux-form.com/7.0.1/docs/api/Field.md/
import dateLight from 'template-tools/src/utils/dateLight'

export const string = (opts = {}) => {
  return Object.assign({}, {

  }, opts)
}

export const money = (opts = {}) => {
  return Object.assign({}, {

  }, opts)
}

export const number = (opts = {}) => {
  return Object.assign({}, {

  }, opts)
}

export const date = (opts = {}) => {
  return Object.assign({}, {
    format: (value) => value ? new Date(value) : value,
    normalize: (value) => value ? dateLight.sqlDate(value, true) : null
  }, opts)
}

export const time = (opts = {}) => {
  return Object.assign({}, {

  }, opts)
}

const Models = {
  string,
  number,
  date,
  time
}

export default Models