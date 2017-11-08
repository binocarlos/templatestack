import React, { Component, PropTypes } from 'react'

import Avatar from 'react-toolbox/lib/avatar'
import GoogleImage from './GoogleImage'

class GoogleUserAvatar extends Component {
  render() {
    return (
      <Avatar>
        <GoogleImage size={64} user={ this.props.user } />
      </Avatar>
    )
  }
}

export default GoogleUserAvatar