import React, { Component } from 'react'
import { List, ListItem, ListSubHeader, ListDivider } from 'react-toolbox/lib/list'

export class ListMenu extends Component {

  getMenuItem(option, i) {
    if(!option) return null

    let item = {
      id: option[0],
      title: option[1],
      icon: option[2]
    }

    if(this.props.process) {
      item = this.props.process(item)
    }

    if(item.id == '-') {
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
          caption={ item.title }
          leftIcon={ item.icon }
          onClick={ () => this.props.onClick(item.id) }
          className={ item.className }
          theme={ item.theme }
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
          this.props.title ? (
            <ListSubHeader caption={ this.props.title } />
          ) : null
        }
        {
          (this.props.options || []).map(this.getMenuItem.bind(this))
        }
      </List>
    )
  }
}

export default ListMenu