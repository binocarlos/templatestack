import React, { Component } from 'react'
import { List, ListItem, ListSubHeader, ListDivider } from 'react-toolbox/lib/list'

import config from '../../config'

const icons = config.icons

export class GuestMenu extends Component {
  render () {
    return (
      <List selectable>
        <ListItem 
          ripple
          caption='Login'
          leftIcon={ icons.login }
          onClick={ () => this.props.onClick('login') }
        />
        <ListItem 
          ripple
          caption='Register'
          leftIcon={ icons.register }
          onClick={ () => this.props.onClick('register') }
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
      </List>
    )
  }
}

export default GuestMenu