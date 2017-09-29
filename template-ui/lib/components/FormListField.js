import React, { Component, PropTypes } from 'react'

import ProgressBar from 'react-toolbox/lib/progress_bar'
import Table from 'template-ui/lib/components/Table'
import ToolbarLayout from './layout2/ToolbarLayout'
import Toolbar from './Toolbar'
import CrudButtonsList from './CrudButtonsList'
import CrudButtonsItem from './CrudButtonsItem'
import CrudDeleteModal from './CrudDeleteModal'
import CrudFormModal from './CrudFormModal'

import horizontal from './theme/horizontal.css'

import icons from '../utils/icons'

class ProjectList extends Component {

  getToolbar() {
    const data = this.props.data || []
    const selected = this.props.selected || []
    const selectedItems = selected.map(i => data[i])

    const buttons = (
      <CrudButtonsList
        icons={icons}
        selected={this.props.selected}
        onClick={ (name) => this.props.toolbarClick(name, selectedItems) }
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
    return (
      <CrudButtonsItem
        icons={icons}
        onClick={ (name) => this.props.itemClick(name, item, i) }
      />
    )
  }

  getTable() {
    const data = this.props.data || []
    const selected = this.props.selected || []
    const selectedItems = selected.map(i => data[i])
    return (
      <Table
        multiSelectable
        onRowSelect={this.props.onSelect}
        data={ data }
        selected={ selected }
        schema={ this.props.table }
        getRowButtons={ this.getRowButtons.bind(this) }
      />
    )
  }

  getDeleteWindow() {
    const data = this.props.data || []
    const selected = this.props.selected || []
    const selectedItems = selected.map(i => data[i])
    return (
      <CrudDeleteModal
        title={ this.props.label }
        active={ this.props.deleteActive ? true : false}
        items={ selectedItems }
        onCancel={ this.props.cancelDeleteWindow }
        onConfirm={ this.props.confirmDeleteWindow }
      />
    )
  }

  getEditWindow() {
    if(this.props.formHook) return null
    return (
      <CrudFormModal
        title={ this.props.label }
        active={ this.props.editActive ? true : false}
        onCancel={ this.props.cancelEditWindow }
        onConfirm={ this.props.confirmEditWindow }
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
        { this.getDeleteWindow() }
        { this.getEditWindow() }
      </ToolbarLayout>
    )
  }
}

export default ProjectList