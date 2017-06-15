"use strict";
const tools = require('./tools')

const title = (num) => {
  if(isNaN(num)) num = 0
  if(num<0) num = num * -1
  return '£' + processMoney(num/100)
}

const processMoney = (n) => {
  const formatted = Math.round(n*100)/100

  const parts = ('' + formatted).split('.')

  const int = parts[0] || '0'
  let float = parts[1] || '00'

  float = float.length == 1 ?
    float + '0' :
    float
  
  return int + '.' + float
}

const sectionPrice = (prices, section, slot) => {
  if(section.id == 'children') return slot.price
  return prices[section.id] || 0
}

const sectionPriceDescription = (prices, section, slot) => {
  const price = sectionPrice(prices, section, slot)
  if(section.id == 'children') {
    return title(slot.price) + ' per child'
  }
  else if(section.data_type == 'children_cost') {
    return title(price) + ' per child'
  }
  else if(section.data_type == 'item_cost') {
    return title(price) + ' each'
  }
  else {
    return null
  }
}

const getStripeDescription = (token) => {
  if(!token) return null
  return token.id
}

module.exports = {
  title,
  processMoney,
  sectionPrice,
  sectionPriceDescription,
  getStripeDescription
}