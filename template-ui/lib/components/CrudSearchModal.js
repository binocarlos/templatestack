import React, { Component, PropTypes } from 'react'

import Modal from './Modal'
import Section from './Section'
import FormLayout from './FormLayout'

import formUtils from '../plugins2/form/utils'

const DEFAULT_SEARCH_FORM = {
  search: {}
}

class CrudSearchModal extends Component {

  render() {
    const title = this.props.title || 'Search'
    const actions = [
      { label: this.props.cancelTitle || "Cancel", onClick: this.props.onCancel },
      { label: this.props.confirmTitle || "Search", onClick: this.props.onConfirm, raised: true, primary: true }
    ]
    const fields = formUtils.getFields(this.props.form || DEFAULT_SEARCH_FORM)
    return (
      <Modal
        actions={ actions }
        title={`${title}`}
        active={this.props.active}
        onCancel={this.props.onCancel}
        onConfirm={this.props.onConfirm}
      >
        <FormLayout
          fields={ fields }
        />

      </Modal>
    )
  }
}

export default CrudSearchModal