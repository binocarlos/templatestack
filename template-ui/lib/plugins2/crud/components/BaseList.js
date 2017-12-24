import React, { Component, PropTypes } from 'react'

import ProgressBar from 'react-toolbox/lib/progress_bar'
import ToolbarLayout from 'template-ui/lib/components/layout2/ToolbarLayout'
import Toolbar from 'template-ui/lib/components/Toolbar'
import Table from 'template-ui/lib/components/Table'
import CrudButtonsListToolbar from 'template-ui/lib/components/CrudButtonsListToolbar'
import IconButtons from 'template-ui/lib/components/IconButtons'
import CrudDeleteModal from 'template-ui/lib/components/CrudDeleteModal'

import horizontal from 'template-ui/lib/components/theme/horizontal.css'

import config from '../config'
import tables from '../tables'

const BaseListFactory = (opts = {}) => {
  return class BaseList extends Component {

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
      let title = `${opts.title} (${count})`

      if(selectedItems.length == 1) {
        title = selectedItems[0].name
      }

      return (
        <Toolbar
          leftIcon={ opts.icon }
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
          schema={ opts.table }
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
            title={ opts.title }
            active={ this.props.deleteActive }
            items={ selectedItems }
            onCancel={ this.props.cancelDeleteWindow }
            onConfirm={ this.props.confirmDeleteWindow }
          />
        </ToolbarLayout>
      )
    }
  }
}

export default BaseListFactory