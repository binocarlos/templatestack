import React, { Component, PropTypes } from 'react'

import ProgressBar from 'react-toolbox/lib/progress_bar'
import ToolbarLayout from 'template-ui/lib/components/layout2/ToolbarLayout'
import Toolbar from 'template-ui/lib/components/Toolbar'
import Table from 'template-ui/lib/components/Table'
import CrudButtonsListToolbar from 'template-ui/lib/components/CrudButtonsListToolbar'
import IconButtons from 'template-ui/lib/components/IconButtons'
import CrudDeleteModal from 'template-ui/lib/components/CrudDeleteModal'

import horizontal from 'template-ui/lib/components/theme/horizontal.css'

import config from '../../config'
import tables from '../../tables'

class UserList extends Component {

  getToolbar() {
    const data = this.props.data || []

    const buttons = (
      <div>
        search box was here
      </div>
    )

    const count = data.length
    let title = `Users (${count})`

    return (
      <Toolbar
        leftIcon={ config.icons.users }
        title={ title }
        leftContent={ buttons }
      />
    )
  }

  getRowButtons(item, i) {
    return (
      <IconButtons
        options={[
          ['edit', 'Edit', config.icons.edit, {}]
        ]}
        onClick={ (name) => this.props.itemClick(name, item, i) }
      />
    )
  }

  getTable() {
    const data = this.props.data || []
    const selected = this.props.selected || []
    const selectedItems = selected.map(i => data[i])
    if(!this.props.loaded) {
      return (
        <ProgressBar
          type="circular"
          mode="indeterminate"
        />
      )
    }

    return (
      <Table
        showHead
        selectable={ false }
        data={ data }
        schema={ tables.user }
        getRowButtons={ this.getRowButtons.bind(this) }
      />
    )
  }

  render() {
    const data = this.props.data || []
    const selected = this.props.selected || []
    const selectedItems = selected.map(i => data[i])
    return (
      <ToolbarLayout
        toolbar={this.getToolbar()}
      >
        { this.getTable() }
        <CrudDeleteModal
          title='User'
          active={ this.props.deleteActive }
          items={ selectedItems }
          onCancel={ this.props.cancelDeleteWindow }
          onConfirm={ this.props.confirmDeleteWindow }
        />
      </ToolbarLayout>
    )
  }
}

export default UserList