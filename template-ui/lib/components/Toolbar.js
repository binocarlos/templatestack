import React, { Component, PropTypes } from 'react'
import AppBar from 'react-toolbox/lib/app_bar'

import theme from './theme/toolbar.css'

class Toolbar extends Component {
  render() {
    return (
      <AppBar
        theme={ theme }
        flat
        title={ this.props.title}
        leftIcon={ this.props.leftIcon }
        rightIcon={ this.props.rightIcon }
        onLeftIconClick={ this.props.onLeftIconClick }
        onRightIconClick={ this.props.onRightIconClick }
      >
        { this.props.children }
      </AppBar>
    )
  }
}

export default Toolbar