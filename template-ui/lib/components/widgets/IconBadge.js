import React, { Component, PropTypes } from 'react'
import { IconMenu as UIIconMenu, MenuItem, MenuDivider } from 'react-toolbox/lib/menu'
import Chip from 'react-toolbox/lib/chip'
import Avatar from 'react-toolbox/lib/avatar'

import theme from './theme/iconbadge.css'

const STYLES = {
  container: {
    display: 'flex',
    alignItems: 'center'
  }
}

class IconBadge extends Component {

  render() {
    const classNames = [this.props.className]
    if(this.props.primary) {
      classNames.push(theme.primaryBadge)
    }
    if(this.props.dark) {
      classNames.push(theme.primaryDarkBadge)
    }
    const className = classNames.filter(c => c).join(' ')
    return (
      <div style={STYLES.container}>
          <Chip>
            <Avatar className={className} icon={this.props.icon} />
            <span>{this.props.name}</span>
          </Chip>
      </div>
    )
  }
}

export default IconBadge