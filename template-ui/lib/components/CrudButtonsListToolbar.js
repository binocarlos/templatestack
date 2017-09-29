import React, { Component, PropTypes } from 'react'

import { Button } from 'react-toolbox/lib/button'
import IconButtons from './IconButtons'

class CrudButtonsList extends Component {

  render() {
    let buttons = null
    const icons = this.props.icons
    const selected = (this.props.selected || []).length

    if(selected <= 0) {
      return (
        <Button
          label='Add'
          icon={icons.add}
          primary={this.props.primary}
          accent={this.props.secondary}
          raised
          onClick={() => this.props.onClick('add')}
        />
      )
    }
    else {
      let options = []
      if(selected == 1) {
        options.push(['edit', 'Edit', icons.edit, {primary:true,raised:true}])
      }
      if(selected >=1) {
        options.push(['delete', 'Delete', icons.delete])
      }
      return (
        <IconButtons
          options={options}
          onClick={(id) => this.props.onClick(id)}
        />
      )
    }
  }
}

export default CrudButtonsList