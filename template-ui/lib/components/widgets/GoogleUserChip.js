import React, { Component, PropTypes } from 'react'

import Chip from 'react-toolbox/lib/chip'
import GoogleUserAvatar from './GoogleUserAvatar'

import theme from './theme/googleuserchip.css'

import selectors from './googleselectors'

class GoogleUserChip extends Component {
  render() {
    const user = this.props.user || {}
    const textThemes = [ theme.text ]
    if(this.props.whiteText) {
      textThemes.push(theme.whiteText)
    }
    return selectors.type(user) == 'google' ? (
      <Chip theme={ theme }>
        <span className={ textThemes.join(' ') }>{ selectors.name(user) }</span>
        <GoogleUserAvatar size={ this.props.size } user={ user } />
      </Chip>
    ) : (
      <Chip theme={ theme }>
        <span className={ textThemes.join(' ') }>{ user.username }</span>
      </Chip>
    )
  }
}

export default GoogleUserChip