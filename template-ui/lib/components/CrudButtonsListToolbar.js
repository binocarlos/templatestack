import React, { Component, PropTypes } from 'react'

import { Button } from 'react-toolbox/lib/button'
import IconButtons from './IconButtons'

class CrudButtonsList extends Component {

  render() {
    let buttons = null
    const icons = this.props.icons
    const selected = (this.props.selected || []).length
    let options = []

    if(selected <= 0) {
      options.push(['add', 'Add', icons.add, {
        primary: this.props.primary,
        accent: this.props.secondary,
      }])
    }
    else {
      if(selected >=1) {
        options.push(['delete', 'Delete', icons.delete, {}])
      }
      if(selected == 1) {
        options.push(['edit', 'Edit', icons.edit, {}])
      }
    }
    return (
      <IconButtons
        options={options}
        onClick={(id) => this.props.onClick(id)}
      />
    )
  }
}

export default CrudButtonsList