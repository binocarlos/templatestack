import React, { Component, PropTypes } from 'react'

import theme from './theme/tree.css'

class Tree extends Component {

  treeStyle() {
    return {
      width: (this.props.width || '200px'),
      minWidth: this.props.minWidth
    }
  }

  render() {
    return (
      <div className={ theme.container }>
        <div className={ theme.tree } style={ this.treeStyle() }>
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