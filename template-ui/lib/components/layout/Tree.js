import React, { Component, PropTypes } from 'react'

import { Layout, Panel, NavDrawer } from 'react-toolbox/lib/layout'

const STYLES = {
  panel: {
    height: 'calc(100vh-65px)',
    maxHeight: 'calc(100vh-65px)',
    top: '0px'
  }
}

class TreeLayout extends Component {
  render() {

    const tree = this.props.tree ? (
      <NavDrawer 
        width='normal'
        pinned={true}
        clipped={true}
        scrollY
      >
        { this.props.tree }
      </NavDrawer>
    ) : null

    return (
      <Layout>
        {tree}
        <Panel bodyScroll={this.props.bodyScroll ? true : false} style={ STYLES.panel }>
          { this.props.children }
        </Panel>
      </Layout>
    )
  }
}

export default TreeLayout