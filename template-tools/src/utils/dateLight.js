const utcParts = (date) => {
  date = date || new Date()
  const year = date.getUTCFullYear()
  const month = date.getUTCMonth() + 1
  const day = date.getUTCDate()
  return {
    year,
    month,
    day
  }
}

const sqlDate = (date, trim = false) => {
  const dateString = typeof(date) === 'string' ? date : date.toISOString()
  return trim ? dateString.split('T')[0] : dateString
}

// turn 16.3 into {hour:16,minute:30}
const getTime = (t) => {
  const h = Math.round(t)
  const m = (t % 1) * 100
  return {
    hour: h,
    minute: m || 0
  }
}


module.exports = {
  utcParts,
  sqlDate,
  getTime
}