import React, { Component, PropTypes } from 'react'

import GoogleImage from './GoogleImage'
import theme from './theme/googleimage.css'

import selectors from './googleselectors'

class GoogleUserImage extends Component {
  render() {
    const user = this.props.user || {}
    return (
      <div className={ theme.container }>
        <div className={ theme.avatar }>
          <GoogleImage
            user={ this.props.user }
            size={ this.props.size }
            className={ this.props.imageClassName }
          />
          <div id="user-name-label" className={ theme.username }>
            <h2>{ selectors.name(user) }</h2>
          </div>
        </div>
      </div>
    )
  }
}

export default GoogleUserImage