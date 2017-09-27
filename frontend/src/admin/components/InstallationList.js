import React, { Component, PropTypes } from 'react'

import { Table, TableHead, TableRow, TableCell } from 'react-toolbox/lib/table'

import config from '../config'
import ToolbarLayout from 'template-ui/lib/components/layout2/ToolbarLayout'
import Toolbar from 'template-ui/lib/components/Toolbar'

class InstallationList extends Component {
  render() {
    const toolbar = (
      <Toolbar
        leftIcon={ config.icons.project }
        title='Projects'
      />
    )
    const data = this.props.data || []
    const selected = this.props.selected || []

    console.log('-------------------------------------------');
    console.log('-------------------------------------------');
    console.dir(selected)
    return (
      <ToolbarLayout
        toolbar={toolbar}
      >
        <Table multiSelectable onRowSelect={this.props.onSelect} style={{ marginTop: 10 }}>
          <TableHead>
            <TableCell>Name</TableCell>
            <TableCell></TableCell>
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