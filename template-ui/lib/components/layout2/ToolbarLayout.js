import React, { Component, PropTypes } from 'react'

import theme from './theme/toolbar.css'

class Toolbar extends Component {
  render() {
    return (
      <div className={ theme.container }>
        <div className={ theme.toolbar }>
          { this.props.toolbar }
        </div>
        <div className={ theme.content }>
          { this.props.children }
        </div>
      </div>
    )
  }
}

export default Toolbar