import React, { Component } from 'react'
import Dialog from 'react-toolbox/lib/dialog'

import theme from './theme/modal.css'

export class Modal extends Component {

  defaultActions() {

  }
  render () {

    const props = {
      ...this.props,
      theme
    }

    return (
      <Dialog {...props} />
    )
  }
}

export default Modal