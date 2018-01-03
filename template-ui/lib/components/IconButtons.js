import React, { Component } from 'react'

import {Button, IconButton} from 'react-toolbox/lib/button'
import Tooltip from 'react-toolbox/lib/tooltip'
import Navigation from 'react-toolbox/lib/navigation'
import ButtonMenu from './ButtonMenu'

const TooltipButton = Tooltip(Button)

export class IconButtons extends Component {

  getMenuItem(option, i) {
    if(!option) return null
    const id = option[0]
    const title = option[1]
    const icon = option[2]
    const props = option[3]
    const options = option[4]
    
    if(options) {
      return (
        <ButtonMenu
          icon={ icon }
          tooltip={ title }
          key={ i }
          options={ options }
          onClick={ () => this.props.onClick(id) }
          {...props}
        />
      )
    }
    else {
      return (
        <TooltipButton
          tooltip={ title } 
          icon={ icon }
          onClick={ () => this.props.onClick(id) }
          key={ i }
          floating
          mini
          {...props}
        />
      )
    }
    
  }

  render () {
    return (
      <Navigation direction='horizontal'>
        {
          (this.props.options || []).map(this.getMenuItem.bind(this))
        }
      </Navigation>
    )
  }
}

export default IconButtons