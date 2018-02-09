import React, { Component, PropTypes } from 'react'

import Toolbar from 'template-ui/lib/components/Toolbar'
import ToolbarLayout from 'template-ui/lib/components/layout2/ToolbarLayout'
import Calendar from '../../shared/components/Calendar'

import BookingFormDropdown from '../containers/BookingFormDropdown'
import CalendarSearch from '../containers/CalendarSearch'

import config from '../config'

class CalendarEditor extends Component {
  getToolbar() {
    const dropdown = (
      <BookingFormDropdown
        onChange={ (bookingForm) => this.props.switchBookingForm(bookingForm) }
      />
    )

    const search = (
      <CalendarSearch

      />
    )

    return (
      <Toolbar
        leftIcon={ config.icons.calendar }
        title={ `Calendar` }
        leftContent={ dropdown }
        rightContent={ search }
      />
    )
  }

  getCalendar() {
    return (
      <div>
        <div>{this.props.bookingForm.name}</div>
        <Calendar />
      </div>
    )
  }

  render() {
    return (
      <ToolbarLayout
        toolbar={this.getToolbar()}
      >
        { this.getCalendar() }
      </ToolbarLayout>
    )
  }
}

export default CalendarEditor