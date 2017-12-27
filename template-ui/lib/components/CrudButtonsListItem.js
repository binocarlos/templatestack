import React, { Component, PropTypes } from 'react'

import IconButtons from './IconButtons'

class CrudButtonsItem extends Component {

  render() {
    const buttons = []
    const icons = this.props.icons || {}

    let options = []

    if(!this.props.hideDelete) {
      options.push(['delete', 'Delete', icons.delete, {}])
    }

    if(!this.props.hideEdit) {
      options.push(['edit', 'Edit', icons.edit, {}])
    }

    return (
      <IconButtons
        options={options}
        onClick={this.props.onClick}
      />
    )
  }
}

export default CrudButtonsItem