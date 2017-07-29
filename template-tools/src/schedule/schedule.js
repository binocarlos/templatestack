"use strict";

// return block array based on the schedule values
const Schedule = (schedule, opts = {}) => {
  const blocks = schedule.blocks || []
  const dayMerge = schedule.merge || {}
  const meta = schedule.meta || {}

  const processedBlocks = blocks.map((block, blockindex) => {
    
    const blockMerge = block.merge || {}

    const slots = (block.slots || []).map((slot, slotindex) => {

      const index = [
        blockindex,
        slotindex
      ].join('-')

      // we allow the slot to override it's own index if it wants
      let slot = Object.assign({}, dayMerge, blockMerge, opts.slotMerge, {
        index
      }, slot, {
        _items: []
      })
      slot = opts.mapSlot ? opts.mapSlot(slot) : slot
      return slot
    })

    return {
      name: block.name,
      slots
    }
  })
  
  let schedule = {
    meta,
    blocks: processedBlocks
  }

  schedule = opts.mapSchedule ? opts.mapSchedule(schedule) : schedule

  const ret = Object.assign({}, {
    meta,
    blocks: processedBlocks
  }, opts.mergeSchedule)

  return schedule
}

module.exports = Schedule