'use strict'

const singleExtractor = (done) => (err, raw) => {
  if(err) return done(err)
  if(!raw) return done(null, null)
  raw = raw.result || raw
  raw = raw.constructor === Array ?
    raw[0] :
    raw
  done(null, raw)
}

module.exports = {
  singleExtractor
}