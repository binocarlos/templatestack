"use strict";

// return block array based on the schedule values
const Schedule = (schedule, opts = {}) => {
  const blocks = schedule.blocks || []
  const scheduleMerge = schedule.merge || {}
  const meta = schedule.meta || {}

  const processedBlocks = blocks.map((block, blockindex) => {
    
    const blockMerge = block.merge || {}

    const slots = (block.slots || []).map((slot, slotindex) => {

      const index = [
        blockindex,
        slotindex
      ].join('-')

      // we allow the slot to override it's own index if it wants
      const createdSlot = Object.assign({}, scheduleMerge, blockMerge, opts.mergeSlot, {
        index
      }, slot, {
        _items: []
      })

      return opts.processSlot ?
        opts.processSlot(createdSlot) :
        createdSlot
    })

    return {
      name: block.name,
      slots
    }
  })
  
  const ret = Object.assign({}, {
    meta,
    blocks: processedBlocks
  }, opts.mergeSchedule)

  return ret
}

module.exports = Schedule