import React, { Component, PropTypes } from 'react'
import { reduxForm } from 'redux-form'

import ProgressBar from 'react-toolbox/lib/progress_bar'
import Table from './Table'
import ToolbarLayout from './layout2/ToolbarLayout'
import Toolbar from './Toolbar'
import CrudButtonsListToolbar from './CrudButtonsListToolbar'
import CrudButtonsListItem from './CrudButtonsListItem'
import CrudDeleteModal from './CrudDeleteModal'
import Modal from './Modal'
import FormLayout from './FormLayout'
import FormModal from './FormModal'
import SearchResultsModal from './SearchResultsModal'

import formUtils from 'template-ui/lib/plugins2/form/utils'
import horizontal from './theme/horizontal.css'

import icons from '../utils/icons'

class FormListField extends Component {

  getToolbar() {
    const data = this.props.data || []
    const selected = this.props.hideTableEdit ? [] : (this.props.selected || [])
    const selectedItems = selected.map(i => data[i]).filter(i => i)

    const buttons = this.props.getToolbarButtons ? this.props.getToolbarButtons(this.props) : (
      <CrudButtonsListToolbar
        icons={icons}
        selected={ selected }
        onClick={ (name) => this.props.toolbarClick(name, selectedItems, selected) }
      />
    )

    const count = selected.length > 0 ? selected.length : data.length
    let title = `${this.props.label} (${count})`

    if(selectedItems.length == 1) {
      title = selectedItems[0].name
    }

    return (
      <Toolbar
        leftIcon={ this.props.icon }
        title={ title }
        leftContent={ buttons }
        clearBackground
        small
      />
    )
  }

  getRowButtons(item, i) {
    const buttons = (
      <CrudButtonsListItem
        icons={icons}
        hideDelete={this.props.hideTableDelete}
        hideEdit={this.props.hideTableEdit}
        onClick={ (name) => this.props.itemClick(name, item, i) }
      />
    )

    if(this.props.wrapRowButtons) {
      return this.props.wrapRowButtons(item, buttons)
    }
    else {
      return buttons
    }
  }

/*

  selectable={ this.props.selectable }
        multiSelectable={ this.props.multiSelectable }
  
*/
  getTable() {
    const data = this.props.data || []
    const selected = this.props.selected || []
    const selectedItems = selected.map(i => data[i])
    return (
      <Table
        showHead={ this.props.showHead }
        selectable={ this.props.selectable ? true : false }
        multiSelectable={ this.props.multiSelectable ? true : false }
        data={ data }
        selected={ selected }
        schema={ this.props.table }
        getRowButtons={ this.getRowButtons.bind(this) }
        onSelect={ this.props.onSelect }
        onItemUpdate={ this.props.updateItemValue }
      />
    )
  }

  getDeleteWindow() {
    const data = this.props.data || []
    const selected = this.props.selected || []
    const selectedItems = selected.map(i => data[i])
    return (
      <CrudDeleteModal
        title={ this.props.itemTitle || this.props.label }
        active={ this.props.deleteWindow ? true : false}
        items={ selectedItems }
        onCancel={ this.props.cancelDeleteWindow }
        onConfirm={ () => this.props.confirmDeleteWindow(selected) }
      />
    )
  }

  getItemWindow() {
    if(this.props.formHook) return null
    if(this.props.itemWindowComponent) {
      const ItemWindowComponent = this.props.itemWindowComponent
      return (
        <ItemWindowComponent {...this.props} />
      )
    }
    else if(this.props.itemWindowMode == 'search') {
      return (
        <SearchResultsModal
          active={ this.props.itemWindow ? true : false}
          title={ this.props.itemTitle || this.props.label }
          value={ this.props.searchValue }
          data={ this.props.searchResults }
          icon={ this.props.icon }
          getItemTitle={ this.props.getItemTitle }
          onSearch={ this.props.searchBoxChanged }
          onCancel={ this.props.cancelItemWindow }
          onConfirm={ this.props.confirmItemWindow }
        />
      )
    }
    else {
      return (
        <FormModal
          active={ this.props.itemWindow ? true : false}
          title={ this.props.itemTitle || this.props.label }
          form={ this.props.id }
          schema={ this.props.schema }
          values={ this.props.values }
          onCancel={ this.props.cancelItemWindow }
          onConfirm={ this.props.confirmItemWindow }
          onTouchForm={ this.props.touchItemWindow }
          valid={ this.props.valid }
        />
      )
    }
  }

  render() {
    const data = this.props.data || []
    const selected = this.props.selected || []
    const selectedItems = selected.map(i => data[i])
    return (
      <div>
        { this.getToolbar() }
        { this.getTable() }
        { this.getDeleteWindow() }
        { this.getItemWindow() }
      </div>
    )
  }
}

export default FormListField