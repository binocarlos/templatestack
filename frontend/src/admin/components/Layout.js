import React, { Component, PropTypes } from 'react'

import TreeLayout from 'template-ui/lib/components/layout2/TreeLayout'
import ToolbarLayout from 'template-ui/lib/components/layout2/ToolbarLayout'
import LongText from 'template-ui/lib/components/widgets/LongText'
import Toolbar from 'template-ui/lib/components/Toolbar'

class Layout extends Component {
  render() {
    const tree = (
      <LongText
        text='tree'
      />
    )
    const toolbar = (
      <Toolbar title='Test bar' />
    )
    return (
      <TreeLayout
        width='250px'
        tree={tree}
      >
        <ToolbarLayout
          toolbar={toolbar}
        >
          <LongText
            text='content'
          />
        </ToolbarLayout>
      </TreeLayout>
    )
  }
}

export default Layout