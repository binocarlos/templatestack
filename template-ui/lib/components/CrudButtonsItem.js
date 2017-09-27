import React, { Component, PropTypes } from 'react'

import Navigation from 'react-toolbox/lib/navigation'

class CrudButtonsItem extends Component {

  render() {
    const buttons = []
    const icons = this.props.icons || {}

    buttons.push({
      label: 'Edit',
      icon: icons.edit,
      onClick: () => this.props.onClick('edit')
    })
    
    buttons.push({
      label: 'Delete',
      icon: icons.delete,
      onClick: () => this.props.onClick('delete')
    })
    
    return (
      <Navigation
        type='horizontal'
        actions={buttons}
      />
    )
  }
}

export default CrudButtonsItem