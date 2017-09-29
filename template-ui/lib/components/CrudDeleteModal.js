import React, { Component, PropTypes } from 'react'

import Modal from './Modal'

class CrudDeleteModal extends Component {

  render() {
    const items = this.props.items || []
    const count = items.length
    const title = this.props.title || 'Item'
    const actions = [
      { label: this.props.cancelTitle || "Cancel", onClick: this.props.onCancel },
      { label: this.props.confirmTitle || "Confirm", onClick: this.props.onConfirm, raised: true, primary: true }
    ]

    return (
      <Modal
        actions={ actions }
        title={`Delete ${count} ${title}${count == 1 ? '' : 's'}?`}
        active={this.props.active}
        onCancel={this.props.onCancel}
        onConfirm={this.props.onConfirm}
      >
        Are you sure you want to delete {count} {title} {count == 1 ? '' : 's'}?
      </Modal>
    )
  }
}

export default CrudDeleteModal