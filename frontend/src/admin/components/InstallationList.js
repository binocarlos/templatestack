import React, { Component, PropTypes } from 'react'

import { Table, TableHead, TableRow, TableCell } from 'react-toolbox/lib/table'
import ToolbarLayout from 'template-ui/lib/components/layout2/ToolbarLayout'
import Toolbar from 'template-ui/lib/components/Toolbar'
import CrudButtonsList from 'template-ui/lib/components/CrudButtonsList'
import CrudButtonsItem from 'template-ui/lib/components/CrudButtonsItem'
import CrudDeleteModal from 'template-ui/lib/components/CrudDeleteModal'

import horizontal from 'template-ui/lib/components/theme/horizontal.css'

import config from '../config'

class InstallationList extends Component {

  getToolbar() {
    const data = this.props.data || []
    const selected = this.props.selected || []
    const selectedItems = selected.map(i => data[i])

    const buttons = (
      <CrudButtonsList
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

  render() {
    const data = this.props.data || []
    const selected = this.props.selected || []
    const selectedItems = selected.map(i => data[i])
    return (
      <ToolbarLayout
        toolbar={this.getToolbar()}
      >
        <Table multiSelectable onRowSelect={this.props.onSelect} style={{ marginTop: 10 }}>
          <TableHead>
            <TableCell>Name</TableCell>
            <TableCell><span></span></TableCell>
          </TableHead>
          {data.map((item, i) => (
            <TableRow key={i} selected={selected.indexOf(i) >= 0}>
              <TableCell>{item.name}</TableCell>
              <TableCell numeric>
                <CrudButtonsItem
                  icons={config.icons}
                  onClick={ (name) => this.props.itemClick(name, item.id, i) }
                />
              </TableCell>
            </TableRow>
          ))}
        </Table>
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

export default InstallationList