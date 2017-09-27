import React, { Component, PropTypes } from 'react'

import Navigation from 'react-toolbox/lib/navigation'

class CrudButtonsForm extends Component {

  render() {
    const buttons = []
    const icons = this.props.icons
    const selected = (this.props.selected || []).length

    buttons.push({
      label: 'Cancel',
      icon: icons.cancel,
      onClick: () => this.props.onClick('cancel')
    })

    buttons.push({
      label: 'Save',
      icon: icons.save,
      onClick: () => this.props.onClick('save'),
      raised: this.props.valid,
      primary: this.props.valid
    })
    
    return (
      <Navigation
        type='horizontal'
        actions={buttons}
      />
    )
  }
}

export default CrudButtonsForm