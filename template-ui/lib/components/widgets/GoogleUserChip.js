import React, { Component, PropTypes } from 'react'

import Chip from 'react-toolbox/lib/chip'
import GoogleUserAvatar from './GoogleUserAvatar'

import theme from './theme/googleuserchip.css'

import selectors from './googleselectors'

class GoogleUserChip extends Component {
  render() {
    const user = this.props.user || {}
    return (
      <Chip theme={ theme }>
        <span className={ theme.text }>{ selectors.name(user) }</span>
        <GoogleUserAvatar user={ user } />
      </Chip>
    )
  }
}

export default GoogleUserChip