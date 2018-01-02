import React, { Component, PropTypes } from 'react'

import ProgressBar from 'react-toolbox/lib/progress_bar'
import ToolbarLayout from 'template-ui/lib/components/layout2/ToolbarLayout'
import Toolbar from 'template-ui/lib/components/Toolbar'
import Table from 'template-ui/lib/components/Table'
import CrudButtonsListToolbar from 'template-ui/lib/components/CrudButtonsListToolbar'
import IconButtons from 'template-ui/lib/components/IconButtons'
import CrudDeleteModal from 'template-ui/lib/components/CrudDeleteModal'
import CrudSearchModal from 'template-ui/lib/components/CrudSearchModal'

import horizontal from 'template-ui/lib/components/theme/horizontal.css'

const BaseListFactory = (opts = {}) => {
  return class BaseList extends Component {

    getToolbar() {
      const icons = this.props.icons || {}
      const data = this.props.data || []
      const selected = opts.selectable ? (this.props.selected || []) : []
      const selectedItems = selected.map(i => data[i])

      const buttons = (
        <CrudButtonsListToolbar
          primary
          icons={icons}
          selected={selected}
          search={opts.searchActive}
          activeButtons={opts.activeButtons}
          onClick={ (name) => this.props.toolbarClick(name, selectedItems) }
        />
      )

      const count = opts.selectable && selected.length > 0 ? selected.length : data.length
      let title = `${opts.title} (${count})`

      if(opts.selectable && selectedItems.length == 1) {
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
      const icons = this.props.icons || {}
      const rowButtons = opts.getRowButtons ? 
        opts.getRowButtons(item, this.props, i) :
        [
          ['edit', 'Edit', icons.edit, {}]
        ]
      return (
        <IconButtons
          options={ rowButtons }
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
          showHead={ opts.showHead }
          selectable={ opts.selectable ? true : false }
          multiSelectable={ opts.multiSelectable ? true : false }
          data={ data }
          schema={ opts.table }
          getRowButtons={ this.getRowButtons.bind(this) }
          onSelect={ this.props.onSelect }
          selected={ this.props.selected }
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
          <CrudSearchModal
            title={ `Search ${opts.title}s` }
            active={ this.props.searchActive }
            onCancel={ this.props.cancelSearchWindow }
            onConfirm={ this.props.confirmSearchWindow }
          />
        </ToolbarLayout>
      )
    }
  }
}

export default BaseListFactory