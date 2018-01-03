import React, { Component, PropTypes } from 'react'
import theme from './theme/greysidebar.css'

class GreySidebar extends Component {
  render() {
    return (
      <div className={ theme.container }>
        { this.props.children }
      </div>
    )
  }
}

export default GreySidebar