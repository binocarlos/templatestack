const numberTools = require('template-tools/src/utils/number')
const priceTools = require('template-tools/src/utils/price')

const merge = (basePrices = {}) => {
  const defaultPrices = basePrices.default || {}
  return Object
    .keys(basePrices)
    .reduce((all, name) => {
      if(name != 'default') {
        all[name] = Object.assign({}, defaultPrices, basePrices[name])  
      }
      return all
    }, {})
}

const forType = (base, type) => {
  const merged = merge(base)
  return merged[type]
}

const title = (amount) => priceTools.title(amount)

module.exports = {
  merge,
  forType,
  title
}