import React, { Component } from 'react'
import UIAppBar from 'react-toolbox/lib/app_bar'

class AppBar extends Component {
  render () {
    return (
      <UIAppBar
        fixed
        leftIcon='menu'
        onLeftIconClick={ this.props.toggleMenu }
        title="Test"
      />
    )
  }
}

export default AppBar