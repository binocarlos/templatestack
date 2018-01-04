import React, { Component } from 'react'

import { Menu, MenuItem, MenuDivider } from 'react-toolbox/lib/menu'
import { Button, IconButton } from 'react-toolbox/lib/button'
import Tooltip from 'react-toolbox/lib/tooltip'

const TooltipButton = Tooltip(Button)

import whiteIconMenuTheme from './theme/whiteIconMenu.css'
import theme from './theme/buttonMenu.css'

export class ButtonMenu extends Component {

  state = {
    active: false,
  }

  handleButtonClick = (event) => {
    this.setState({ active: !this.state.active })
  }

  handleMenuHide = () => {
    this.setState({ active: false })
  }

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
    const options = this.props.options || []
    return (
      <div className={ theme.container } style={ this.props.style }>
        <TooltipButton
          label={ this.props.label }
          icon={ this.props.icon }
          onClick={this.handleButtonClick}
          accent={this.props.accent}
          primary={this.props.primary}
          raised={this.props.raised}
          floating={this.props.floating}
          mini={this.props.mini}
          tooltip={this.props.tooltip}
        />
        <Menu
          active={this.state.active}
          onHide={this.handleMenuHide}
          position={this.props.position || 'auto'}
        >
          { (options || []).map(this.getMenuItem.bind(this)) }
        </Menu>
      </div>
    )
  }
}

export default ButtonMenu
