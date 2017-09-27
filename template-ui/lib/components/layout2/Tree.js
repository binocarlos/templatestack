import React, { Component, PropTypes } from 'react'

import theme from './theme/tree.css'

class Tree extends Component {
  render() {
    return (
      <div className={ theme.container }>
        <div className={ theme.tree }>
          { this.props.tree }
        </div>
        <div className={ theme.content }>
          { this.props.children }
        </div>
      </div>
    )
  }
}

export default Tree