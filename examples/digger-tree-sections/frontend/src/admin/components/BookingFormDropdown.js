import React, { Component, PropTypes } from 'react'

import Dropdown from 'react-toolbox/lib/dropdown'

class BookingFormDropdown extends Component {
  render() {

    const source = (this.props.bookingForms || []).map(form => ({
      value: form.meta.url,
      label: form.name,
    }))

    const map = (this.props.bookingForms || []).reduce((all, form) => {
      all[form.meta.url] = form
      return all
    }, {})

    const selected = this.props.bookingForm || {}
    const meta = selected.meta || {}

    return (
      <Dropdown
        auto={false}
        source={ source }
        value={ meta.url }
        onChange={ (val) => this.props.onChange(map[val]) }
      />
    )
  }
}

export default BookingFormDropdown