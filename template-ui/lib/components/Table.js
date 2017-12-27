import React, { Component, PropTypes } from 'react'
import { Table, TableHead, TableRow, TableCell } from 'react-toolbox/lib/table'

const defaultGetValue = (key) => (row, props) => row[key]

class TableComponent extends Component {

  getFields() {
    return Object.keys(this.props.schema || {}).map((key) => {
      const opts = this.props.schema[key]
      const getValue = opts.getValue || defaultGetValue(key)
      return Object.assign({}, {
        title: key.replace(/^\w/, (s) => s.toUpperCase()),
        value: getValue
      }, opts)
    })
  }

  getHead() {
    if(!this.props.showHead) return null
    const data = this.props.data || []
    const fields = this.getFields()
    return (
      <TableHead displaySelect={ this.props.multiSelectable && data.length > 0 }>
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

  clickRow(item, i) {
    if(this.props.onRowClick) this.props.onRowClick(item, i)
  }

  getRow(fields, item, i) {
    const selected = this.props.selected || []
    const data = this.props.data || []
    const rowStyle = this.props.getRowStyle ? this.props.getRowStyle(item, i) : {}

    return (
      <TableRow key={i} selected={selected.indexOf(i) >= 0} style={rowStyle} onClick={() => this.clickRow(item, i)}>
        {
          fields.map((field, j) => {
            const style = field.getStyle ? field.getStyle(item, this.props) : {}
            return (
              <TableCell key={ j } style={style}>{field.value(item, this.props, j) || ''}</TableCell>
            )
          })
        }
        {
          this.props.getRowButtons ? (
            <TableCell numeric>
              { this.props.getRowButtons(item, i) }
            </TableCell>
          ) : null
        }
      </TableRow>
    )
  }

  render() {
    const selected = this.props.selected || []
    const data = this.props.data || []
    const fields = this.getFields()

    return (
      <Table
        selectable={ this.props.selectable && data.length > 0 }
        multiSelectable={ this.props.multiSelectable && data.length > 0 }
        onRowSelect={ this.props.onSelect }
      >
        { this.getHead() }
        {
          data.map((item, i) => this.getRow(fields, item, i))
        }
      </Table>
    )
  }
}

export default TableComponent