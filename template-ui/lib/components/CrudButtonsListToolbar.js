import React, { Component, PropTypes } from 'react'

import { Button } from 'react-toolbox/lib/button'
import IconButtons from './IconButtons'

class CrudButtonsList extends Component {

  includeButton(name) {
    if(!this.props.activeButtons) return true
    return this.props.activeButtons[name] ? true : false
  }

  render() {
    let buttons = null
    const icons = this.props.icons
    const selected = (this.props.selected || []).length
    let options = []

    const searchButton = ['search', 'Search', icons.search, {}]
    const addButton = ['add', 'Add', icons.add, {
      primary: this.props.primary,
      accent: this.props.secondary,
    }]
    const deleteButton = ['delete', 'Delete', icons.delete, {}]
    const editButton = ['edit', 'Edit', icons.edit, {}]

    if(selected <= 0) {
      if(this.includeButton('add')) options.push(addButton)

      if(this.props.search) {
        if(this.includeButton('search')) options.push(searchButton)
      }
    }
    else {
      if(selected >=1) {
        if(this.includeButton('delete')) options.push(deleteButton)
      }
      if(selected == 1) {
        if(this.includeButton('edit')) options.push(editButton)
      }
    }
    return (
      <IconButtons
        options={options}
        onClick={(id) => this.props.onClick(id)}
      />
    )
  }
}

export default CrudButtonsList