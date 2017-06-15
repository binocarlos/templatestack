import React, { Component, PropTypes } from 'react'

import FormErrors from '../../booking/components/FormErrors'
import SlotInfo from '../../booking/components/SlotInfo'
import CostInfo from '../../booking/components/CostInfo'

const STYLES = {
  page: {
    padding: '20px'
  }
}

class BookingInfo extends Component {
  render() {
    return (
      <div style={ STYLES.page }>
        <FormErrors
          errors={ this.props.formerrors }
          showErrors={ this.props.showErrors }
        />
        <SlotInfo
          admin
          date={ this.props.date }
          slot={ this.props.slot }
          options={ this.props.formvalues }
          bookingid={ this.props.bookingid }
          paymentInfo={ this.props.paymentInfo }
          chargeInfo={ this.props.chargeInfo }
        />
        <hr />
        <CostInfo
          admin
          quoteme_blocks={ this.props.quoteme_blocks }
          prices={ this.props.prices }
          formvalues={ this.props.formvalues }
          slot={ this.props.slot }
          paymentInfo={ this.props.paymentInfo }
          chargeInfo={ this.props.chargeInfo }
        />
      </div>
    )
  }
}

export default BookingInfo