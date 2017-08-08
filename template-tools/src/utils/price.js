const title = (num, currency = '£') => {
  if(isNaN(num)) num = 0
  //if(num<0) num = num * -1
  return currency + format(num/100)
}

const format = (n) => {
  const formatted = Math.round(n*100)/100

  const parts = ('' + formatted).split('.')

  const int = parts[0] || '0'
  let float = parts[1] || '00'

  float = float.length == 1 ?
    float + '0' :
    float
  
  return int + '.' + float
}

module.exports = {
  title,
  format
}