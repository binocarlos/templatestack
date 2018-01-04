import React, { Component } from 'react'

import {Button, IconButton} from 'react-toolbox/lib/button'
import Tooltip from 'react-toolbox/lib/tooltip'
import Navigation from 'react-toolbox/lib/navigation'
import ButtonMenu from './ButtonMenu'

const TooltipButton = Tooltip(Button)

export class IconButtons extends Component {

  getMenuItem(option, i) {
    if(!option) return null
    let id = option[0]
    let title = option[1]
    let icon = option[2]
    let props = option[3]
    let options = option[4]
    let forceClickId = null

    if(options && options.length == 1) {
      let option = options[0]
      forceClickId = option[0]
      //title = option[1]
      //icon = option[2]
      options = null
    }
    
    if(options) {
      return (
        <ButtonMenu
          icon={ icon }
          tooltip={ title }
          key={ i }
          options={ options }
          onClick={ (clickid) => this.props.onClick(id, clickid) }
          {...props}
        />
      )
    }
    else {
      return (
        <TooltipButton
          tooltip={ title } 
          icon={ icon }
          onClick={ () => this.props.onClick(id, forceClickId) }
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