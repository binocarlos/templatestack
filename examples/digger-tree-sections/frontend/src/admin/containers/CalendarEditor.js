import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import selectors from '../selectors'
import actions from '../actions'

import CalendarEditor from '../components/CalendarEditor'

class CalendarEditorContainer extends Component {
  render() {
    return (
      <CalendarEditor {...this.props} />
    )
  }
}

export default connect(
  (state, ownProps) => ({
    bookingForms: selectors.bookingForms.list(state),
    bookingForm: selectors.bookingForms.current(state),
  }),
  (dispatch) => ({
    switchBookingForm: (bookingForm) => {
      dispatch(actions.router.hook('bookingFormsRedirectTo', bookingForm.id))
    }
  })
)(CalendarEditorContainer)