import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import DatePicker from 'react-toolbox/lib/date_picker'
import Checkbox from 'react-toolbox/lib/checkbox'
import { Button } from 'react-toolbox/lib/button'
import TablePlugin from 'boiler-ui/lib/containers/TablePlugin'
import GenericToolbar from 'boiler-ui/lib/components/toolbars/Generic'
import SearchPlugin from 'boiler-ui/lib/containers/SearchPlugin'

import ToolbarLayout from 'boiler-ui/lib/components/layout/Toolbar'

import BookingSchedule from '../components/BookingSchedule'

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

class BookingScheduleContainer extends Component {
  getToolbar() {

    const search = (
      <div style={ STYLES.container }>
        <div style={ STYLES.searchDiv }>
          from:
        </div>
        <div style={ STYLES.searchDiv }>
          <DatePicker 
            autoOk={ true }
            value={ this.props.search.from }
            onChange={ (val) => {
              if(dates.isDateAfter(val, this.props.search.to)) {
                this.props.updateSearch('scheduleTo', val)  
              }
              this.props.updateSearch('scheduleFrom', val)
            } }
          />
        </div>
        <div style={ STYLES.searchDiv }>
          to:
        </div>
        <div style={ STYLES.searchDiv }>
          <DatePicker 
            autoOk={ true }
            value={ this.props.search.to }
            onChange={ (val) => {
              if(dates.isDateBefore(val, this.props.search.from)) {
                this.props.updateSearch('scheduleFrom', val)  
              }
              this.props.updateSearch('scheduleTo', val)
            } }
          />
        </div>
      </div>
    )
    
    const toolbarProps = {
      title: 'Schedule',
      icon: icons.schedule,
      rightChildren: search
    }

    return (
      <GenericToolbar {...toolbarProps}>
        <Button
          label='Open PDF'
          icon='picture_as_pdf'
          onClick={ () => this.props.openPDF(this.props.search) }
        />
      </GenericToolbar>
    )
  }

  render() {
    return (
      <ToolbarLayout toolbar={ this.getToolbar() }>
        <BookingSchedule
          bookings={ this.props.bookings }
        />
      </ToolbarLayout>
    )
  }
}

export default connect(
  (state) => {
    return {
      search: {
        from: selectors.search.scheduleFrom(state),
        to: selectors.search.scheduleTo(state)
      },
      bookings: selectors.search.scheduleRange(state)
    }
  },
  (dispatch) => {
    return {
      updateSearch: (name, value) => {
        dispatch(actions.updateScheduleSearch(name, value))
      },
      openPDF: () => {
        dispatch(actions.openSchedulePDF())
      }
    }
  }
)(BookingScheduleContainer)
