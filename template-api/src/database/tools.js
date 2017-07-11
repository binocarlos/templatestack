'use strict'

const getSingleRecord = (raw) => {
  raw = raw.result || raw
  raw = raw.constructor === Array ?
    raw[0] :
    raw
  return raw
}

const getAllRecords = (raw) => raw.result || raw

const extractor = (map) => (done) => (err, raw) => {
  if(err) return done(err)
  if(!raw) return done(null, null)
  done(null, map(raw))
}

const singleExtractor = extractor(getSingleRecord)
const allExtractor = extractor(getAllRecords)

module.exports = {
  getSingleRecord,
  getAllRecords,
  extractor,
  singleExtractor,
  allExtractor
}