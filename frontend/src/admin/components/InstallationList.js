import React, { Component, PropTypes } from 'react'

import { Table, TableHead, TableRow, TableCell } from 'react-toolbox/lib/table'
import ToolbarLayout from 'template-ui/lib/components/layout2/ToolbarLayout'
import Toolbar from 'template-ui/lib/components/Toolbar'
import CrudButtonsList from 'template-ui/lib/components/CrudButtonsList'

import horizontal from 'template-ui/lib/components/theme/horizontal.css'

import config from '../config'

class InstallationList extends Component {

  getToolbar() {

    const buttons = (
      <CrudButtonsList
        icons={config.icons}
        selected={this.props.selected}
        onClick={this.props.toolbarClick}
      />
    )

    return (
      <Toolbar
        leftIcon={ config.icons.project }
        title='Projects'
        leftContent={ buttons }
      />
    )
  }

  render() {
    const data = this.props.data || []
    const selected = this.props.selected || []
    return (
      <ToolbarLayout
        toolbar={this.getToolbar()}
      >
        <Table multiSelectable onRowSelect={this.props.onSelect} style={{ marginTop: 10 }}>
          <TableHead>
            <TableCell>Name</TableCell>
            <TableCell style={{width:'1px'}}><span></span></TableCell>
          </TableHead>
          {data.map((item, i) => (
            <TableRow key={i} selected={selected.indexOf(i) >= 0}>
              <TableCell>{item.name}</TableCell>
              <TableCell>buttons</TableCell>
            </TableRow>
          ))}
        </Table>
      </ToolbarLayout>
    )
  }
}

export default InstallationList