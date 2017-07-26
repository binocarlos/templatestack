import React, { Component } from 'react'
import { List, ListItem, ListSubHeader, ListDivider } from 'react-toolbox/lib/list'

export class ListMenu extends Component {

  getMenuItem(option, i) {
    const id = option[0]
    const title = option[1]
    const icon = option[2]
    if(id == '-') {
      return (
        <ListDivider
          key={ i }
        />
      )
    }
    else {
      return (
        <ListItem 
          ripple
          caption={ title }
          leftIcon={ icon }
          onClick={ () => this.props.onClick(id) }
          key={ i }
        />
      )
    }
  }

  render () {
    return (
      <List 
        selectable
      >
        {
          (this.props.options || []).map(this.getMenuItem.bind(this))
        }
      </List>
    )
  }
}

export default ListMenu