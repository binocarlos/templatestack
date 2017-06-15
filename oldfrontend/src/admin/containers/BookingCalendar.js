import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import DatePicker from 'react-toolbox/lib/date_picker'
import Checkbox from 'react-toolbox/lib/checkbox'
import Input from 'react-toolbox/lib/input'
import TablePlugin from 'boiler-ui/lib/containers/TablePlugin'
import GenericToolbar from 'boiler-ui/lib/components/toolbars/Generic'
import SearchPlugin from 'boiler-ui/lib/containers/SearchPlugin'

import ToolbarLayout from 'boiler-ui/lib/components/layout/Toolbar'

import DateOptions from '../../booking/components/DateOptions'

import tools from '../../logic/tools'
import dates from '../../logic/dates'

import tables from '../config/tables'
import icons from '../config/icons'
import plugins from '../plugins'
import selectors from '../selectors'
import actions from '../actions'

const STYLES = {
  container: {
    textAlign: 'right',
    paddingRight: '20px'
  },
  searchDiv: {
    display: 'inline-block',
    paddingRight: '20px'
  }
}

class BookingCalendarContainer extends Component {

  getDay(date, debug) {
    const { calendar, templates, prices, range } = this.props
    return dates.dayInfo(calendar, templates, prices, date, range, debug)
  }

  getDays() {
    const targetDate = this.props.currentDate || new Date()
    const showDays = this.props.currentWindow || 1
    let deltas = []
    for(var i=0; i<showDays; i++) {
      deltas.push(i)
    }
    const days = deltas.map(delta => {
      const d = dates.dateDelta(targetDate, delta)
      return this.getDay(d)
    })
    return days.filter(d => d)
  }

  getToolbar() {

    const search = (
      <div style={ STYLES.container }>
        <div style={ STYLES.searchDiv }>
          date:
        </div>
        <div style={ STYLES.searchDiv }>
          <DatePicker 
            autoOk={ true }
            value={ this.props.currentDate }
            onChange={ (val) => {
              this.props.updateSearch('calendarDate', val)
            } }
          />
        </div>
        <div style={ STYLES.searchDiv }>
          view days:
        </div>
        <div style={ STYLES.searchDiv }>
          <Input 
            type='number'
            value={ this.props.currentWindow || '' }
            onChange={ (val) => {
              this.props.updateSearch('calendarWindow', tools.getNumValue(val))
            } }
          />
        </div>
      </div>
    )
    
    const toolbarProps = {
      title: 'Calendar',
      icon: icons.booking,
      rightChildren: search
    }

    return (
      <GenericToolbar {...toolbarProps} />
    )
  }

  render() {
    return (
      <ToolbarLayout toolbar={ this.getToolbar() }>
        <div>
          <DateOptions 
            admin
            days={ this.getDays() }
            slot={ this.props.slot }
            slotDate={ this.props.currentDate }
            clickSlot={ this.props.clickSlot }
          />
        </div>
      </ToolbarLayout>
    )
  }
}

export default connect(
  (state) => {
    return {
      currentDate: selectors.search.calendarDate(state),
      currentWindow: selectors.search.calendarWindow(state),
      calendar: selectors.config.calendar(state),
      templates: selectors.config.templates(state),
      prices: selectors.config.prices(state),
      range: selectors.search.calendarRange(state)
    }
  },
  (dispatch) => {
    return {
      updateSearch: (name, value) => {
        dispatch(actions.updateCalendarSearch(name, value))
      },
      clickSlot: (date, slot) => {

        if(slot.filled) {
          const bookingid = slot.booking.id
          dispatch(actions.push('/bookings/edit/calendar/' + bookingid))
        }
        else {
          dispatch(actions.resetBooking({
            date: dates.injectStartTime(date, slot.start),
            index: slot.index,
            duration: slot.duration,
            price: slot.price
          }))
          const sqlDate = dates.getSQLDate(date, true)
          dispatch(actions.push('/bookings/fromcalendar/' + sqlDate + '/' + slot.index))
        }
      }
    }
  }
)(BookingCalendarContainer)
