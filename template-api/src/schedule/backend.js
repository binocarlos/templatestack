'use strict'
  
// a bridge between the generic auth frontend and actual sql backend storage
const async = require('async')
const options = require('../utils/options')

const REQUIRED = [

]

const DEFAULTS = {
  topic: 'schedule'
}

const ScheduleBackend = (hemera, opts) => {
  let Joi = hemera.exposition['hemera-joi'].joi

  opts = options.processor(opts, {
    required: REQUIRED,
    defaults: DEFAULTS
  })

  const TOPIC = opts.topic

  /*
  
    range - get a 3 layer array of days / blocks / slots

    * calendar - array of calendar descriptions
    * schedule - object of schedule descriptions
    * start - start date
    * end - end date
    * items - array of objects with
      * id
      * date
      * slotindex (0-1)

    each slot will have an 'items' array with the items that are allocated to that slot
    
  */
  hemera.add({
    topic: TOPIC,
    cmd: 'range',
    calendar: Joi.array(),
    schedule: Joi.object(),
    start: Joi.string(),
    end: Joi.string(),
    items: Joi.array()

  }, (req, done) => {
    console.log('-------------------------------------------');
    console.log('-------------------------------------------');
    done(null, req)
  })

}

module.exports = ScheduleBackend