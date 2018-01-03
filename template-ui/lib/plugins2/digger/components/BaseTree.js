import React, { Component, PropTypes } from 'react'

import TreeLayout from '../../../components/layout2/TreeLayout'
import ListTree from '../../../components/ListTree'
import GreySidebar from '../../../components/GreySidebar'

const BaseTreeFactory = (opts = {}) => {
  return class BaseTree extends Component {

    render() {
      const tree = (
        <GreySidebar>
          <ListTree
            data={ this.props.data }
            onClick={ this.props.clickTree }
            getIcon={ opts.getIcon }
            selectedId={ this.props.selectedId }
          />
        </GreySidebar>
      )

      return (
        <TreeLayout
          tree={ tree }
          width={ opts.width }
        >
          { this.props.children }
        </TreeLayout>
      )
    }
  }
}

export default BaseTreeFactory