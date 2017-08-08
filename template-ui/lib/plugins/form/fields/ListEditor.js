import React, { Component } from 'react'
import { Button } from 'react-toolbox/lib/button'
import Navigation from 'react-toolbox/lib/navigation'
import { List, ListItem, ListSubHeader, ListDivider } from 'react-toolbox/lib/list'

export class ListEditor extends Component {

  getItem(option, i) {
    if(!option) return null
    const id = option[0]
    const title = option[1]
    const icon = option[2]
 
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

  render () {
    return (
      <div>
        <List 
          selectable
        >
          {
            this.props.title ? (
              <ListSubHeader caption={ this.props.title } />
            ) : null
          }
          <Navigation type='horizontal'>
          <Button
            label='Add'
            icon='add'
            onClick={ () => this.props.onAction('add') }
          />
          { this.props.buttons }
        </Navigation>
          {
            (this.props.items || []).map(this.getItem.bind(this))
          }
        </List>
      </div>
    )
  }
}

export default ListEditor