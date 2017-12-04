import React, { Component, PropTypes } from 'react'

import theme from './theme/googleImage.css'
import selectors from './googleselectors'

class GoogleImage extends Component {

  getURL() {
    const size = this.props.size || 48
    const user = this.props.user || {}
    const photo = selectors.photo(user)
    if(!photo) return ''
    const urlParts = photo.split('?')
    return urlParts[0] + `?sz=${size}`
  }

  render() {
    return (
      <img id="google-img" src={ this.getURL() } className={ this.props.className } />
    )
  }
}

export default GoogleImage