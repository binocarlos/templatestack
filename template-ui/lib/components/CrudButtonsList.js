import React, { Component, PropTypes } from 'react'

import Navigation from 'react-toolbox/lib/navigation'

class CrudButtonsList extends Component {

  render() {
    const buttons = []
    const icons = this.props.icons
    const selected = (this.props.selected || []).length

    if(selected <= 0) {
      buttons.push({
        label: 'Add',
        icon: icons.add,
        primary: true,
        raised: true,
        onClick: () => this.props.onClick('add')
      })
    }

    if(selected == 1) {
      buttons.push({
        label: 'Edit',
        icon: icons.edit,
        onClick: () => this.props.onClick('edit')
      })
    }

    if(selected >= 1) {
      buttons.push({
        label: 'Delete',
        icon: icons.delete,
        onClick: () => this.props.onClick('delete')
      })
    }
    
    return (
      <Navigation
        type='horizontal'
        actions={buttons}
      />
    )
  }
}

export default CrudButtonsList