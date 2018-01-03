import React, { Component, PropTypes } from 'react'

import ProgressBar from 'react-toolbox/lib/progress_bar'
import ToolbarLayout from '../../../components/layout2/ToolbarLayout'
import Toolbar from '../../../components/Toolbar'
import Table from '../../../components/Table'
import CrudButtonsListToolbar from '../../../components/CrudButtonsListToolbar'
import IconButtons from '../../../components/IconButtons'
import CrudDeleteModal from '../../../components/CrudDeleteModal'
import CrudSearchModal from '../../../components/CrudSearchModal'

import horizontal from '../../../components/theme/horizontal.css'

const BaseListFactory = (opts = {}) => {
  return class BaseList extends Component {

    getToolbar() {
      if(opts.getToolbar) {
        return opts.getToolbar(this.props)
      }

      const icons = this.props.icons || {}
      const data = this.props.data || []
      const selected = opts.selectable ? (this.props.selected || []) : []
      const selectedItems = selected.map(i => data[i])

      const count = opts.selectable && selected.length > 0 ? selected.length : data.length
      let title = `${opts.title} (${count})`

      if(opts.selectable && selectedItems.length == 1) {
        title = selectedItems[0].name
      }

      if(opts.getTitle) {
        title = opts.getTitle(this.props)
      }

      let buttons = (
        <CrudButtonsListToolbar
          primary
          icons={icons}
          selected={selected}
          activeButtons={opts.activeButtons}
          onClick={ (name, clickname) => this.props.toolbarClick(name, selectedItems, clickname) }
        />
      )

      if(opts.getToolbarButtons) {
        const options = opts.getToolbarButtons(this.props)
        buttons = (
          <IconButtons
            options={ options }
            onClick={ (name, clickname) => this.props.toolbarClick(name, selectedItems, clickname) }
          />
        )
      }

      const useIcon = opts.getIcon ? opts.getIcon(this.props) : opts.icon
      
      return (
        <Toolbar
          leftIcon={ useIcon }
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

      let title = opts.title

      if(opts.getTitle) {
        title = opts.getTitle(this.props)
      }

      return (
        <ToolbarLayout
          toolbar={this.getToolbar()}
        >
          { this.getTable() }
          <CrudDeleteModal
            title={ title }
            active={ this.props.deleteActive }
            items={ selectedItems }
            onCancel={ this.props.cancelDeleteWindow }
            onConfirm={ this.props.confirmDeleteWindow }
          />
          <CrudSearchModal
            title={ `Search ${title}` }
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