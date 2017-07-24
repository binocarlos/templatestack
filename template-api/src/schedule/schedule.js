"use strict";

// return block array based on the schedule values
const Schedule = (schedule) => {
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
      return Object.assign({}, dayMerge, blockMerge, {
        index
      }, slot)
    })

    return {
      name: block.name,
      slots
    }
  })

  return {
    meta,
    blocks: processedBlocks
  }
}

module.exports = Schedule