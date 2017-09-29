import React, { Component, PropTypes } from 'react'

import ProgressBar from 'react-toolbox/lib/progress_bar'
import ToolbarLayout from 'template-ui/lib/components/layout2/ToolbarLayout'
import Toolbar from 'template-ui/lib/components/Toolbar'
import Table from 'template-ui/lib/components/Table'
import CrudButtonsListToolbar from 'template-ui/lib/components/CrudButtonsListToolbar'
import CrudButtonsListItem from 'template-ui/lib/components/CrudButtonsListItem'
import CrudDeleteModal from 'template-ui/lib/components/CrudDeleteModal'

import horizontal from 'template-ui/lib/components/theme/horizontal.css'

import config from '../config'
import tables from '../tables'

class ProjectList extends Component {

  getToolbar() {
    const data = this.props.data || []
    const selected = this.props.selected || []
    const selectedItems = selected.map(i => data[i])

    const buttons = (
      <CrudButtonsListToolbar
        primary
        icons={config.icons}
        selected={this.props.selected}
        onClick={ (name) => this.props.toolbarClick(name, selectedItems) }
      />
    )

    const count = selected.length > 0 ? selected.length : data.length
    let title = `Projects (${count})`

    if(selectedItems.length == 1) {
      title = selectedItems[0].name
    }

    return (
      <Toolbar
        leftIcon={ config.icons.project }
        title={ title }
        leftContent={ buttons }
      />
    )
  }

  getRowButtons(item, i) {
    return (
      <CrudButtonsListItem
        icons={config.icons}
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
        multiSelectable
        data={ data }
        selected={ selected }
        schema={ tables.project }
        onSelect={this.props.onSelect}
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
          title='Project'
          active={ this.props.deleteActive }
          items={ selectedItems }
          onCancel={ this.props.cancelDeleteWindow }
          onConfirm={ this.props.confirmDeleteWindow }
        />
      </ToolbarLayout>
    )
  }
}

export default ProjectList