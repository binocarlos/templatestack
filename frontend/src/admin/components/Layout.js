import React, { Component, PropTypes } from 'react'

import Tree from 'template-ui/lib/components/layout2/Tree'
import LongText from 'template-ui/lib/components/widgets/LongText'

class Layout extends Component {
  render() {
    const tree = (
      <LongText
        text='tree'
      />
    )
    return (
      <Tree
        tree={tree}
      >
        <LongText
          text='content'
        />
      </Tree>
    )
  }
}

export default Layout