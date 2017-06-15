import React, { Component, PropTypes } from 'react'
import { Layout, Panel, NavDrawer } from 'react-toolbox/lib/layout'

const STYLES = {
  panel: {
    height: 'calc(100vh)',
    maxHeight: 'calc(100vh)',
    top: '65px'
  }
}

class TreeLayout extends Component {

  render() {

    return (
      <Layout>
        <NavDrawer 
          width='normal'
          pinned={true}
          clipped={true}
          scrollY
        >
          { this.props.tree }
        </NavDrawer>
        <Panel bodyScroll={false} style={ STYLES.panel }>
          { this.props.children }
        </Panel>
      </Layout>
    )
  }
}

export default TreeLayout