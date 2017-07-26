const isNumber = (value) => {
  const n = parseFloat(value)
  return isNaN(n) ? false : true
}

const twodp = (value) => {
  if(!isNumber(value)) return value
  return Math.round((value || 0) * 100)/100 
}

const getNumValue = (val) => {
  const numVal = parseFloat(val)
  const useVal = isNaN(val) ? val : numVal
  return useVal
}

const zeroPad = (value, maxLength = 2) => {
  let zeros = ''
  let count = 0
  while(count < maxLength) {
    zeros += '0'
    count++
  }
  return (zeros + value.toString()).slice(-maxLength)
}

module.exports = {
  isNumber,
  twodp,
  getNumValue,
  zeroPad
}