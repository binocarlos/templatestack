import React, { Component } from 'react'
import { List, ListItem, ListSubHeader, ListDivider } from 'react-toolbox/lib/list'

import config from '../../config'

const icons = config.icons

export class UserMenu extends Component {
  render () {
    return (
      <List selectable>
        <ListItem 
          ripple
          caption='Dashboard'
          leftIcon={ icons.dashboard }
          onClick={ () => this.props.onClick('dashboard') }
        />
        <ListDivider />
        <ListItem 
          ripple
          caption='Help'
          leftIcon={ icons.help }
          onClick={ () => this.props.onClick('help') }
        />
        <ListItem 
          ripple
          caption='About'
          leftIcon={ icons.about }
          onClick={ () => this.props.onClick('about') }
        />
        <ListDivider />
        <ListItem 
          ripple
          caption='Logout'
          leftIcon={ icons.logout }
          onClick={ () => this.props.onClick('logout') }
        />
      </List>
    )
  }
}

export default UserMenu