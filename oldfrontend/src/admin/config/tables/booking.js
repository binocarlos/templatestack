import React, { Component, PropTypes } from 'react'
import Chip from 'react-toolbox/lib/chip'
import Avatar from 'react-toolbox/lib/avatar'
import Button from 'react-toolbox/lib/button'
import Tooltip from 'react-toolbox/lib/tooltip'
import Navigation from 'react-toolbox/lib/navigation'

import icons from '../icons'
import dates from '../../../logic/dates'

const BOOKING_TABLE = {
  schema: {
    date: {type: String},
    time: {type: String},
    ref: {type: String},
    name: {type: String},
    childName: {type: String},
    email: {type: String},
    phone: {type: String},
    actions: {}
  },
  map: (props) => (item, i) => {

    const bookingDate = new Date(item.name)

    const dateSt = dates.getDateTitle(bookingDate)
    const timeSt = dates.getTimeTitle(bookingDate)

    const meta = item.meta || {}
    const info = meta.info || {}
    const options = meta.options || {}

    const ref = meta.bookingid || ''
    const children = options.children || '0'
    const adults = options.adults || '0'

    const name = info.name || ''
    const childName = info.child_name || ''
    const age = info.age || ''
    const email = info.email || ''
    const phone = info.mobile || ''
    
    return {
      id: item.id,
      date: dateSt,
      time: timeSt,
      ref,
      name,
      children,
      adults,
      childName,
      age,
      email,
      phone,
      actions: (
        <div style={{
          display: 'flex',
          justifyContent: 'left'
        }}>
          <Navigation type='horizontal'>
            <Button 
              ripple={true}
              icon={ icons.delete }
              floating
              mini 
              onClick={() => {
                props.select([i])
                props.openDeleteWindow()
              }} />
            <Button 
              ripple={true}
              icon={ icons.edit }
              floating
              mini 
              onClick={() => {
                props.edit(item.id)
              }} />
          </Navigation>
        </div>
      )
    }
  }
}

export default BOOKING_TABLE