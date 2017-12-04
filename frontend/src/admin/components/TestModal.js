import React, { Component, PropTypes } from 'react'

import Modal from 'template-ui/lib/components/Modal'

class TestModal extends Component {

  render() {
    const actions = [
      {
        label: this.props.cancelTitle || "Cancel",
        onClick: this.props.cancelItemWindow 
      },
      {
        label: this.props.confirmTitle || "Save",
        onClick: () => this.props.confirmItemWindow({id: 12, name: 'APPLES2'}),
        raised: this.props.valid,
        primary: this.props.valid
      }
    ]

    return (
      <Modal
        actions={ actions }
        title={ this.props.title }
        active={ this.props.itemWindow }
        onEscKeyDown={this.props.cancelItemWindow}
        onOverlayClick={this.props.cancelItemWindow}
      >
        <p>HELLO WORLD</p>
      </Modal>
    )
    
  }
}

export default TestModal