import React, { Component, PropTypes } from 'react'
import { Table, TableHead, TableRow, TableCell } from 'react-toolbox/lib/table'

class TableComponent extends Component {

  getFields() {
    return Object.keys(this.props.schema).map((key) => {
      const opts = this.props.schema[key]
      return Object.assign({}, {
        title: key.replace(/^\w/, (s) => s.toUpperCase()),
        value: (row, props) => row[key]
      }, opts)
    })
  }

  getHead() {
    const fields = this.getFields()
    return (
      <TableHead>
        {
          fields.map((field, i) => {
            return (
              <TableCell key={ i } numeric={ field.numeric }>{ field.title }</TableCell>
            )
          })
        }
        {
          this.props.getRowButtons ? (
            <TableCell><span></span></TableCell>
          ) : null
        }
      </TableHead>
    )
  }

  render() {
    const selected = this.props.selected || []
    const data = this.props.data || []
    const fields = this.getFields()
    return (
      <Table
        selectable={ this.props.selectable }
        multiSelectable={ this.props.multiSelectable }
        onRowSelect={this.props.onSelect}
      >
        { this.getHead() }
        {
          data.map((item, i) => (
            <TableRow key={i} selected={selected.indexOf(i) >= 0}>
              {
                fields.map((field, j) => (
                  <TableCell key={ j }>{field.value(item, this.props)}</TableCell>
                ))
              }
              {
                this.props.getRowButtons ? (
                  <TableCell numeric>
                    { this.props.getRowButtons(item, i) }
                  </TableCell>
                ) : null
              }
            </TableRow>
          ))
        }
      </Table>
    )
  }
}

export default TableComponent