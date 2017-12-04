import React, { Component, PropTypes } from 'react'

import IconButtons from './IconButtons'

class CrudButtonsItem extends Component {

  render() {
    const buttons = []
    const icons = this.props.icons || {}

    const options = [
      ['delete', 'Delete', icons.delete, {}],
      ['edit', 'Edit', icons.edit, {}]
    ]
    
    return (
      <IconButtons
        options={options}
        onClick={this.props.onClick}
      />
    )
  }
}

export default CrudButtonsItem