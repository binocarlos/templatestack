import React, { Component, PropTypes } from 'react'
import Chip from 'react-toolbox/lib/chip'
import Avatar from 'react-toolbox/lib/avatar'

import theme from './theme/iconBadge.css'

class IconBadge extends Component {

  render() {
    return (
      <div className={ theme.container }>
        <Chip>
          <Avatar 
            className={ this.props.className } 
            icon={ this.props.icon} 
          />
          <span>
            { this.props.name }
          </span>
        </Chip>
      </div>
    )
  }
}

export default IconBadge