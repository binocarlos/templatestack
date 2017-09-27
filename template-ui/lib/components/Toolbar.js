import React, { Component, PropTypes } from 'react'
import AppBar from 'react-toolbox/lib/app_bar'

import theme from './theme/toolbar.css'

class Toolbar extends Component {
  render() {
    const props = {
      ...this.props,
      flat: true,
      theme
    }
    return (
      <AppBar {...props} />
    )
  }
}

export default Toolbar