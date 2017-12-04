import React, { Component } from 'react'
import { IconMenu, MenuItem, MenuDivider } from 'react-toolbox/lib/menu'

import whiteIconMenuTheme from './theme/whiteIconMenu.css'

export class IconMenuComponent extends Component {

  getMenuItem(option, i) {
    if(!option) return null
    const id = option[0]
    const title = option[1]
    const icon = option[2]
    if(id == '-') {
      return (
        <MenuDivider
          key={ i }
        />
      )
    }
    else {
      return (
        <MenuItem 
          caption={ title }
          icon={ icon }
          onClick={ () => this.props.onClick(id) }
          key={ i }
        />
      )
    }
  }

  render () {
    return (
      <IconMenu 
        icon={ this.props.icon || 'more_vert' } 
        position='topRight' 
        menuRipple
        iconRipple
        theme={ this.props.theme || (this.props.dark ? {} : whiteIconMenuTheme) }
      >
        {
          (this.props.options || []).map(this.getMenuItem.bind(this))
        }
      </IconMenu>
    )
  }
}

export default IconMenuComponent