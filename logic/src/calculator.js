"use strict";
const pricetools = require('./prices')
// functions to work out the price of a single section
// if the type has no entry - it has no cost
const EXTRA_COSTS = {
  children_cost: (prices, section, values, childrenCount) => {
    const price = values[section.id] ? 
      prices[section.id] || 0 :
      0
    return {
      title: section.title,
      summary: childrenCount + ' x ' + pricetools.title(price),
      total: childrenCount * price
    }
  },
  item_cost: (prices, section, values, childrenCount) => {
    const price = values[section.id] ? 
      prices[section.id] || 0 :
      0
    return {
      title: section.title,
      summary: pricetools.title(price),
      total: price
    }
  }
}

const getSectionPrice = (prices, section, values, childrenCount) => {
  if(!EXTRA_COSTS[section.data_type]) return 0
  return EXTRA_COSTS[section.data_type](prices, section, values, childrenCount)
}

// turn a single section into an array of objects
// each represents a cost to the quote
// each object has:
//  * amount
//  * title
//
const EXTRACTORS = {
  number: (prices, section, values, childrenCount) => {
    const count = values[section.id] || 0
    const price = prices[section.id] || 0
    const total = count * price
    return {
      title: section.title,
      summary: count + ' x ' + pricetools.title(price),
      total: total
    }
  },
  checkbox: (prices, section, values, childrenCount) => {
    return getSectionPrice(prices, section, values, childrenCount)
  },
  multiple_checkbox: (prices, section, values, childrenCount) => {
    const value = values[section.id] || []
    const count = value.length
    const price = prices[section.id] || 0
    const total = count * price
    return {
      title: section.title,
      summary: count + ' x ' + pricetools.title(price),
      total: total
    }
  }
}


const calculate = (quoteme_blocks, prices, formvalues, slot, paymentInfo) => {

  paymentInfo = paymentInfo || {}
  const childrenPrice = slot.price
  const childrenCount = formvalues.children || 0

  const sections = quoteme_blocks
    .reduce((all, block) => all.concat(block.sections), [])

  const extraCosts = sections
    // only use sections that have a type of cost
    .filter(section => EXTRA_COSTS[section.data_type])
    // extract the input into individual costs
    .map(section => {
      const extractor = EXTRACTORS[section.input_type]
      return extractor(prices, section, formvalues, childrenCount)
    })
    .filter(costSection => costSection.total)
    .concat(paymentInfo.deposit ? [{
      title: 'Deposit',
      summary: 'Paid ' + pricetools.title(paymentInfo.deposit) + ' (' + paymentInfo.mode + ')',
      total: -paymentInfo.deposit
    }] : [])

  const childrenCost = {
    title: 'Children',
    summary: childrenCount + ' x ' + pricetools.title(childrenPrice),
    total: childrenCount * childrenPrice
  }

  const allCosts = [childrenCost].concat(extraCosts)

  const total = allCosts.reduce((total, cost) => {
    return total + cost.total
  }, 0)

  return {
    total: total,
    extras: allCosts
  }
}

module.exports = calculate