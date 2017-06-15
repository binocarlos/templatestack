"use strict";
const sqlDate = (date) => {
  date = date || new Date()
  return date.getUTCFullYear() + '-' +
    ('00' + (date.getUTCMonth() + 1)).slice(-2) + '-' +
    ('00' + date.getUTCDate()).slice(-2)
}

const isNumber = (value) => {
  const n = parseFloat(value)
  return isNaN(n) ? false : true
}

const twodp = (value) => {
  if(!isNumber(value)) return value
  return Math.round((value || 0) * 100)/100 
}

const makeid = () => {
  let text = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  for( let i=0; i < 5; i++ )
      text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

const getNumValue = (val) => {
  const numVal = parseFloat(val)
  const useVal = isNaN(val) ? val : numVal
  return useVal
}

module.exports = {
  sqlDate,
  twodp,
  makeid,
  getNumValue
}