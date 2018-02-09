import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import selectors from '../selectors'
import actions from '../actions'

import BookingFormDropdown from '../components/BookingFormDropdown'

class BookingFormDropdownContainer extends Component {
  render() {
    return (
      <BookingFormDropdown {...this.props} />
    )
  }
}

export default connect(
  (state, ownProps) => ({
    bookingForms: selectors.bookingForms.list(state),
    bookingForm: selectors.bookingForms.current(state),
  }),
  (dispatch) => ({
    
  })
)(BookingFormDropdown)