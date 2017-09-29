import React, { Component, PropTypes } from 'react'

import IconMenu from './IconMenu'

class CrudButtonsItem extends Component {

  render() {
    const buttons = []
    const icons = this.props.icons || {}

    const options = [
      ['edit', 'Edit', icons.edit],
      ['delete', 'Delete', icons.delete]
    ]

    buttons.push({
      label: this.props.hideLabels ? '' : 'Edit',
      icon: icons.edit,
      onClick: () => this.props.onClick('edit')
    })
    
    buttons.push({
      label: this.props.hideLabels ? '' : 'Delete',
      icon: icons.delete,
      onClick: () => this.props.onClick('delete')
    })
    
    return (
      <IconMenu
        dark
        options={options}
        onClick={this.props.onClick}
      />
    )
  }
}

export default CrudButtonsItem