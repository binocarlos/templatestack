import React, { Component, PropTypes } from 'react'

import dates from '../../logic/dates'
import schedule from '../../logic/schedule'

const STYLES = {
  padding: {
    padding: '20px'
  },
  bookingpadding: {
    padding: '5px',
    marginBottom: '20px'
  },
  infopadding: {
    padding: '5px'
  },
  infoheader: {
    fontSize: '1.2em',
    marginBottom: '10px'
  },
  infotitle: {
    display: 'inline-block',
    width: '200px',
    maxWidth: '200px'
  },
  infovalue: {
    display: 'inline-block'
  }
}

const HIDE_SECTIONS = {
  children: true,
  adults: true
}

class BookingSchedule extends Component {
  render() {

    const days = schedule.rangeSchedule(this.props.bookings)

    return (
      <div style={ STYLES.padding }>
        {
          days.map((day, i) => {
            return (
              <div key={ i }>
                <h3>{ day.title }</h3>
                <hr />
                <div style={ STYLES.padding }>
                  {
                    (day.bookings || []).map((booking, j) => {

                      const sections = booking.sections || []

                      const foodType = sections.filter(section => section.id == 'foodtype')[0]

                      if(!foodType) {
                        sections.push({
                          id: 'foodtype',
                          value: 'cold'
                        })
                      }

                      return (
                        <div key={ j } style={ STYLES.bookingpadding }>
                          <div style={ STYLES.infoheader }>
                            <b>{ booking.title }</b> - { booking.child_name } ({ booking.age }) - { booking.children } children
                          </div>
                          <div>
                          {
                            sections
                            .map((item, k) => item.id + '=' + item.value)
                            .join(', ')
                          }
                          </div>
                        </div>
                      )
                    })
                  }
                </div>
              </div>
            )
          })
        }
      </div>
    )
  }
}

export default BookingSchedule