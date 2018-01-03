import React, { Component, PropTypes } from 'react'

import TreeLayout from '../../../components/layout2/TreeLayout'

const BaseTreeFactory = (opts = {}) => {
  return class BaseTree extends Component {

    render() {
      const tree = (
        <div>
          tree
        </div>
      )

      return (
        <TreeLayout
          tree={ tree }
        >
          { this.props.children }
        </TreeLayout>
      )
    }
  }
}

export default BaseTreeFactory